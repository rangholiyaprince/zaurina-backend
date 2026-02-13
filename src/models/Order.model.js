const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  items: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'WatchProduct',
        required: true
      },
      productTitle: {
        type: String,
        required: true
      },
      variantName: {
        type: String,
        required: true
      },
      price: {
        type: Number,
        required: true
      },
      qty: {
        type: Number,
        required: true
      },
      image: {
        type: String
      }
    }
  ],
  totalAmount: {
    type: Number,
    required: true
  },
  shippingAddress: {
    addressLabel: { type: String },
    firstName: { type: String },
    lastName: { type: String },
    addressLine1: { type: String },
    addressLine2: { type: String },
    city: { type: String },
    state: { type: String },
    postalCode: { type: String },
    country: { type: String },
    phone_code: { type: String },
    phone_number: { type: String }
  },
  status: {
    type: String,
    enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
    default: 'pending'
  },
  payment_status: {
    type: String,
    enum: ['pending', 'paid', 'failed'],
    default: 'pending'
  },
  payment_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Payment'
  },
  estimatedDeliveryDate: {
    type: Date
  },
  deliveryTime: {
    type: String
  }
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
