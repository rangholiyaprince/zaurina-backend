const mongoose = require('mongoose');

const gemDetailsSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Gem Detail name is required'],
    trim: true
  },
  type: {
    type: String,
    enum: {
      values: [
        'GEM_TYPE',
        'GEM_CUT',
        'GEM_SETTING',
        'GEM_POLISH',
        'GEM_CLARITY',
        'GEM_COLOR'
      ],
      message: '{VALUE} is not a valid gem detail type'
    },
    required: [true, 'Gem Detail type is required'],
    trim: true
  }
}, { timestamps: true });

module.exports = mongoose.model('GemDetail', gemDetailsSchema);
