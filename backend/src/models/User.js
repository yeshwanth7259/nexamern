const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    index: true,
  },
  mobile: {
    type: String,
    required: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  referralCode: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  referredBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null,
  },
  walletBalance: {
    type: Number,
    default: 0,
  },
  totalROIEarned: {
    type: Number,
    default: 0,
  },
  totalLevelIncome: {
    type: Number,
    default: 0,
  },
  status: {
    type: String,
    enum: ['Active', 'Suspended', 'Inactive'],
    default: 'Active',
  },
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
