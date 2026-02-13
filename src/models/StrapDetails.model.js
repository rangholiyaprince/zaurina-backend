const mongoose = require('mongoose');

const strapDetailsSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Strap Detail name is required'],
    trim: true
  },
  type: {
    type: String,
    enum: {
      values: [
        'STRAP_TYPE',
        'WATCH_STRAP',
        'WATCH_CLASP'
      ],
      message: '{VALUE} is not a valid strap detail type'
    },
    required: [true, 'Strap Detail type is required'],
    trim: true
  }
}, { timestamps: true });

module.exports = mongoose.model('StrapDetail', strapDetailsSchema);
