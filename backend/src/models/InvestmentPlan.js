const mongoose = require('mongoose');

const investmentPlanSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  minAmount: {
    type: Number,
    required: true,
  },
  maxAmount: {
    type: Number,
    required: true,
  },
  dailyROIPercentage: {
    type: Number,
    required: true,
  },
  durationDays: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ['Active', 'Inactive'],
    default: 'Active',
  },
}, { timestamps: true });

module.exports = mongoose.model('InvestmentPlan', investmentPlanSchema);
