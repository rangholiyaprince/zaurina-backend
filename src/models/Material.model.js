const mongoose = require('mongoose');

const materialSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Material name is required'],
    trim: true
  },
  type: {
    type: String,
    enum: {
      values: ['WATCH', 'CASE'],
      message: '{VALUE} is not a valid material type. Allowed types: WATCH, CASE'
    },
    required: [true, 'Material type is required'],
    trim: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Material', materialSchema);
