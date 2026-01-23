const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  addressLabel: {
    type: String,
    required: true,
    trim: true,
    maxLength: 50
  },
  firstName: {
    type: String,
    required: true,
    trim: true,
    maxLength: 100
  },
  lastName: {
    type: String,
    required: true,
    trim: true,
    maxLength: 100
  },
  addressLine1: {
    type: String,
    required: true,
    trim: true,
    maxLength: 255
  },
  addressLine2: {
    type: String,
    trim: true,
    maxLength: 255,
    default: null
  },
  city: {
    type: String,
    required: true,
    trim: true,
    maxLength: 100
  },
  state: {
    type: String,
    required: true,
    trim: true,
    maxLength: 100
  },
  postalCode: {
    type: String,
    required: true,
    trim: true,
    maxLength: 20
  },
  country: {
    type: String,
    required: true,
    trim: true,
    default: "United States"
  },
  phone_code: {
    type: String,
    trim: true,
    default: null
  },
  phone_number: {
    type: String,
    trim: true,
    default: null
  },
  isDefault: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

module.exports = mongoose.model('Address', addressSchema);
