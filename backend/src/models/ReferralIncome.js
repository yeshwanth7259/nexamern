const mongoose = require('mongoose');

const referralIncomeSchema = new mongoose.Schema({
  receiverId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  sourceUserId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  investmentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Investment',
    required: true,
  },
  level: {
    type: Number,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
}, { timestamps: true });

module.exports = mongoose.model('ReferralIncome', referralIncomeSchema);
