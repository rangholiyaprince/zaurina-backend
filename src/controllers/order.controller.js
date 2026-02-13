const Order = require('../models/Order.model');
const Payment = require('../models/Payment.model');
const Cart = require('../models/Cart.model');
const User = require('../models/User.model');
const stripe = require('../config/stripe');

/**
 * @desc    Create Order from Stripe Session
 * @route   POST /api/order/create-order
 * @access  Private
 */
exports.createOrder = async (req, res) => {
  try {
    const userId = req.user._id;
    const {
      items,
      totalAmount,
      shippingAddress,
      paymentInfo,
      estimatedDeliveryDate,
      deliveryTime
    } = req.body;

    // Validate required fields
    if (!items || items.length === 0) {
      return res.status(400).json({ success: false, message: 'Order items are required' });
    }

    if (!totalAmount) {
      return res.status(400).json({ success: false, message: 'Total amount is required' });
    }

    if (!shippingAddress) {
      return res.status(400).json({ success: false, message: 'Shipping address is required' });
    }

    if (!paymentInfo || !paymentInfo.transaction_id) {
      return res.status(400).json({ success: false, message: 'Payment information with transaction ID is required' });
    }


    // 1. Create Order
    const newOrder = new Order({
      user_id: userId,
      items: items.map(item => ({
        product: item.product, // Assuming product ID is passed
        productTitle: item.productTitle,
        variantName: item.variantName,
        price: item.price,
        qty: item.qty,
        image: item.image
      })),
      totalAmount: totalAmount,
      shippingAddress: {
        addressLabel: shippingAddress.addressLabel || 'Shipping Address',
        firstName: shippingAddress.firstName || req.user.first_name,
        lastName: shippingAddress.lastName || req.user.last_name,
        addressLine1: shippingAddress.addressLine1 || 'N/A',
        addressLine2: shippingAddress.addressLine2 || '',
        city: shippingAddress.city || 'N/A',
        state: shippingAddress.state || 'N/A',
        postalCode: shippingAddress.postalCode || 'N/A',
        country: shippingAddress.country || 'N/A',
        phone_code: shippingAddress.phone_code || '',
        phone_number: shippingAddress.phone_number || req.user.phone_number
      },
      payment_status: paymentInfo.payment_status || 'paid', // Default to paid if not specified, or use from payload
      status: 'processing',
      estimatedDeliveryDate: estimatedDeliveryDate || null,
      deliveryTime: deliveryTime || null
    });

    const savedOrder = await newOrder.save();

    // 2. Create Payment Record
    const newPayment = new Payment({
      user_id: userId,
      order_id: savedOrder._id,
      payment_method: paymentInfo.payment_method || 'stripe',
      transaction_id: paymentInfo.transaction_id,
      amount: paymentInfo.amount || totalAmount,
      currency: paymentInfo.currency || 'usd',
      status: paymentInfo.status || 'succeeded'
    });

    await newPayment.save();

    // 3. Link Payment to Order
    savedOrder.payment_id = newPayment._id;
    await savedOrder.save();

    // Note: We are NOT clearing the cart here as this endpoint is now decoupled from the Cart model.
    // If cart clearing is needed, it should be done via a separate call or explicitly requested.

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      order: savedOrder
    });

  } catch (error) {
    console.error('Create Order Error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

/**
 * @desc    Get all orders for a user
 * @route   GET /api/user/orders
 * @access  Private
 */
exports.getUserOrders = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const orders = await Order.find({ user_id: userId })
      .populate({
        path: 'items.product',
        select: 'productTitle brand swiss_price quartz_price media'
      })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: orders.length,
      data: orders
    });
  } catch (error) {
    console.error('Get User Orders Error:', error);
    next(error);
  }
};

/**
 * @desc    Get all orders (Admin)
 * @route   GET /api/admin/orders
 * @access  Private (Admin)
 */
exports.getAllOrders = async (req, res, next) => {
  try {
    const orders = await Order.find()
      .populate('user_id', 'first_name last_name email')
      .populate({
        path: 'items.product',
        select: 'productTitle brand swiss_price quartz_price media'
      })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: orders.length,
      data: orders
    });
  } catch (error) {
    console.error('Get All Orders Error:', error);
    next(error);
  }
};
