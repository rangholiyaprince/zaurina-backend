const mongoose = require('mongoose');

const watchDetailsSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Watch Detail name is required'],
    trim: true
  },
  value: {
    type: String,
    required: [true, 'Watch Detail value is required'],
    trim: true
  },
  type: {
    type: String,
    enum: {
      values: [
        'WATCH_BRAND',
        'WATCH_MODEL',
        'WATCH_TYPE',
        'WATCH_DISPLAY',
        'WATCH_MOVEMENT',
        'WATCH_FUNCTIONALITY',
        'WATCH_MATERIAL',
        'CASE_MATERIAL',
        'CASE_SHAPE',
        'CASE_BACK',
        'STRAP_TYPE',
        'WATCH_STRAP',
        'WATCH_CLASP',
        'DIAL_STYLE',
        'GEM_SETTING',
        'AGE_GROUP',
        'WATCH_WEIGHT',
        'CROWN',
        'BEZEL_TYPE'
      ],
      message: '{VALUE} is not a valid watch detail type'
    },
    required: [true, 'Watch Detail type is required'],
    trim: true
  }
}, { timestamps: true });

module.exports = mongoose.model('WatchDetail', watchDetailsSchema);
