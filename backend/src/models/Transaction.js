const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  type: {
    type: String,
    enum: ['Investment', 'ROI Credit', 'Referral Credit', 'Withdrawal', 'Deposit'],
    required: true,
  },
  amount: {
    type: Number,
    required: true, // Negative for deductions (Investment, Withdrawal), Positive for credits
  },
  referenceId: {
    type: mongoose.Schema.Types.ObjectId, // Could be InvestmentId, ROIHistoryId, ReferralIncomeId
    required: false,
  },
  description: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['Success', 'Pending', 'Failed'],
    default: 'Success',
  },
}, { timestamps: true });

module.exports = mongoose.model('Transaction', transactionSchema);
