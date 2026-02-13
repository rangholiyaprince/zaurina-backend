const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  count: {
    type: Number,
    default: 0
  },
  subTotal: {
    type: Number,
    default: 0
  },
  totalPrice: {
    type: Number,
    default: 0
  },
  items: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'WatchProduct',
        required: true
      },
      productTitle: {
        type: String
      },
      variantName: {
        type: String,
        required: true // e.g., 'Swiss', 'Quartz'
      },
      price: {
        type: Number,
        required: true
      },
      qty: {
        type: Number,
        required: true,
        default: 1
      },
      image: {
        type: String
      }
    }
  ]
}, { timestamps: true });

// Calculate totals before saving
cartSchema.pre('save', async function () {
  let count = 0;
  let total = 0;

  if (this.items && this.items.length > 0) {
    this.items.forEach(item => {
      count += item.qty;
      total += item.price * item.qty;
    });
  }

  this.count = count;
  this.subTotal = total;
  this.totalPrice = total; // Can add tax/shipping here later if needed
});

module.exports = mongoose.model('Cart', cartSchema);
