const mongoose = require('mongoose');

const colorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Color name is required'],
    trim: true
  },
  value: {
    type: String,
    required: [true, 'Color value (hex/code) is required'],
    trim: true
  },
  type: {
    type: String,
    enum: {
      values: ['BAND', 'CASE', 'DIAL', 'STRAP', 'GEM'],
      message: '{VALUE} is not a valid color type'
    },
    required: [true, 'Color type is required']
  }
}, { timestamps: true });

module.exports = mongoose.model('Color', colorSchema);
