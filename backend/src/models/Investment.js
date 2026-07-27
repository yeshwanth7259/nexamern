const mongoose = require('mongoose');

const investmentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  planId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'InvestmentPlan',
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  startDate: {
    type: Date,
    required: true,
    default: Date.now,
  },
  endDate: {
    type: Date,
    required: true,
  },
  dailyROI: {
    type: Number,
    required: true, // snapshot from plan
  },
  status: {
    type: String,
    enum: ['Active', 'Completed', 'Cancelled'],
    default: 'Active',
  },
}, { timestamps: true });

module.exports = mongoose.model('Investment', investmentSchema);
