const mongoose = require('mongoose');

const caseDetailsSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Case Detail name is required'],
    trim: true
  },
  type: {
    type: String,
    enum: {
      values: [
        'SHAPE',
        'SIZE',
        'BACK',
        'WATER_RESISTANCE'
      ],
      message: '{VALUE} is not a valid case detail type'
    },
    required: [true, 'Case Detail type is required'],
    trim: true
  }
}, { timestamps: true });

module.exports = mongoose.model('CaseDetail', caseDetailsSchema);
