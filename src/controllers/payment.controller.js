const stripe = require('../config/stripe');
const Cart = require('../models/Cart.model');

/**
 * @desc    Create Payment Intent
 * @route   POST /api/payment/create-payment-intent
 * @access  Private
 */
exports.createPaymentIntent = async (req, res) => {
  try {
    const { currency } = req.body;
    const userId = req.user._id;

    // 1. Get User's Cart
    const cart = await Cart.findOne({ user_id: userId });

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ success: false, message: 'Cart is empty' });
    }

    // 2. Calculate Total Amount (Backend Logic)
    // Always recalculate to be safe, though cart.totalPrice should be up-to-date
    const amount = Math.round(cart.totalPrice); // Stripe expects integer (e.g., cents, paisa) if currency suggests, but for INR major unit depends.
    // Stripe amount represents the smallest currency unit.
    // For INR: 100 paise = 1 INR. So multiply by 100.
    // Ensure payload matches this expectation.
    // If cart.totalPrice is in INR (e.g. 52500), then amount should be 52500 * 100.

    if (amount <= 0) {
      return res.status(400).json({ success: false, message: 'Invalid amount' });
    }

    // 3. Create Payment Intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100, // Convert to smallest unit (e.g. cents for USD)
      currency: currency || 'usd',
      automatic_payment_methods: {
        enabled: true,
      },
      metadata: {
        userId: userId.toString(),
        cartId: cart._id.toString()
      }
    });

    res.status(200).json({
      success: true,
      clientSecret: paymentIntent.client_secret,
    });

  } catch (error) {
    console.error('Stripe Error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

/**
 * @desc    Create Stripe Checkout Session
 * @route   POST /api/payment/create-checkout-session
 * @access  Private
 */
exports.createCheckoutSession = async (req, res) => {
  try {
    const userId = req.user._id;

    // 1. Get User's Cart
    const cart = await Cart.findOne({ user_id: userId });

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ success: false, message: 'Cart is empty' });
    }

    // 2. Map Cart Items to Stripe Line Items
    const lineItems = cart.items.map((item) => {
      return {
        price_data: {
          currency: 'usd', // Default to USD
          product_data: {
            name: item.variantName ? `${item.productTitle} - ${item.variantName}` : item.productTitle,
            images: item.image ? [item.image] : [],
            metadata: {
              productId: item.product.toString()
            }
          },
          unit_amount: Math.round(item.price * 100), // Amount in smallest unit (paise)
        },
        quantity: item.qty,
      };
    });

    // 3. Create Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: req.body.success_url,
      cancel_url: req.body.cancel_url,
      metadata: {
        userId: userId.toString(),
        cartId: cart._id.toString()
      }
    });

    res.status(200).json({
      success: true,
      sessionId: session.id,
      url: session.url
    });

  } catch (error) {
    console.error('Stripe Checkout Error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};
