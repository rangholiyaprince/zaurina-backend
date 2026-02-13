const mongoose = require('mongoose');

const dialDetailsSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Dial Detail name is required'],
    trim: true
  },
  type: {
    type: String,
    enum: {
      values: [
        'DIAL_STYLE',
        'HANDS'
      ],
      message: '{VALUE} is not a valid dial detail type'
    },
    required: [true, 'Dial Detail type is required'],
    trim: true
  }
}, { timestamps: true });

module.exports = mongoose.model('DialDetail', dialDetailsSchema);
