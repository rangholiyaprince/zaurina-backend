const mongoose = require('mongoose');

const otherDetailsSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Detail name is required'],
    trim: true
  },
  type: {
    type: String,
    enum: {
      values: [
        'AGE_GROUP',
        'WATCH_WEIGHT',
        'CROWN',
        'BEZEL_TYPE'
      ],
      message: '{VALUE} is not a valid detail type'
    },
    required: [true, 'Detail type is required'],
    trim: true
  }
}, { timestamps: true });

module.exports = mongoose.model('OtherDetail', otherDetailsSchema);
