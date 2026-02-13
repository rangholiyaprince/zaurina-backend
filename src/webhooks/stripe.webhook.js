const User = require('../models/User.model');
const Cart = require('../models/Cart.model');
const Order = require('../models/Order.model');
const Payment = require('../models/Payment.model');

module.exports = async (req, res) => {
  const sig = req.headers['stripe-signature'];

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error(`Webhook Error: ${err.message}`);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  switch (event.type) {
    case 'payment_intent.succeeded':
      const paymentIntent = event.data.object;
      console.log(`PaymentIntent for ${paymentIntent.amount} was successful!`);
      break;

    case 'checkout.session.completed':
      const session = event.data.object;
      console.log(`Checkout Session ${session.id} was completed!`);
      try {
        await handleCheckoutSessionCompleted(session);
      } catch (error) {
        console.error('Error handling checkout session:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
      }
      break;

    case 'payment_intent.payment_failed':
      const pi = event.data.object;
      console.log(`PaymentIntent failed: ${pi.last_payment_error?.message}`);
      break;
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  res.json({ received: true });
};

async function handleCheckoutSessionCompleted(session) {
  const { userId, cartId } = session.metadata;

  if (!userId || !cartId) {
    throw new Error('Missing metadata in Stripe session');
  }

  const user = await User.findById(userId);
  const cart = await Cart.findById(cartId);

  if (!user || !cart) {
    throw new Error('User or Cart not found');
  }

  // 1. Create Order
  const newOrder = new Order({
    user_id: userId,
    items: cart.items.map(item => ({
      product: item.product,
      productTitle: item.productTitle,
      variantName: item.variantName,
      price: item.price,
      qty: item.qty,
      image: item.image
    })),
    totalAmount: session.amount_total / 100, // Convert from cents
    shippingAddress: {
      // Stripe session doesn't always return address unless collected.
      // Assuming we rely on user profile or what Stripe collected if enabled.
      // For now, we'll try to extract from session if available, else placeholders/user profile.
      // Note: address collection needs to be enabled in checkout session creation for this to populate in session.shipping_details
      addressLabel: 'Shipping Address',
      firstName: session.customer_details?.name ? session.customer_details.name.split(' ')[0] : user.first_name,
      lastName: session.customer_details?.name ? session.customer_details.name.split(' ').slice(1).join(' ') : user.last_name,
      addressLine1: session.shipping_details?.address?.line1 || 'N/A',
      addressLine2: session.shipping_details?.address?.line2 || '',
      city: session.shipping_details?.address?.city || 'N/A',
      state: session.shipping_details?.address?.state || 'N/A',
      postalCode: session.shipping_details?.address?.postal_code || 'N/A',
      country: session.shipping_details?.address?.country || 'N/A',
      phone_number: session.customer_details?.phone || user.phone_number
    },
    payment_status: 'paid',
    status: 'processing'
  });

  const savedOrder = await newOrder.save();

  // 2. Create Payment Record
  const newPayment = new Payment({
    user_id: userId,
    order_id: savedOrder._id,
    payment_method: 'stripe',
    transaction_id: session.payment_intent, // Checkout session is linked to a payment intent
    amount: session.amount_total / 100,
    currency: session.currency,
    status: 'succeeded'
  });

  const savedPayment = await newPayment.save();

  // 3. Link Payment to Order
  savedOrder.payment_id = savedPayment._id;
  await savedOrder.save();

  // 4. Clear Cart
  cart.items = [];
  cart.count = 0;
  cart.subTotal = 0;
  cart.totalPrice = 0;
  await cart.save();

  console.log(`Order ${savedOrder._id} created and Payment ${savedPayment._id} recorded.`);
}
