const mongoose = require('mongoose');

const roiHistorySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  investmentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Investment',
    required: true,
    index: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  date: {
    type: String, // YYYY-MM-DD format to easily query daily runs
    required: true,
  },
  status: {
    type: String,
    enum: ['Credited', 'Failed'],
    default: 'Credited',
  },
}, { timestamps: true });

// Compound index to ensure uniqueness per investment per day (idempotent)
roiHistorySchema.index({ investmentId: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('ROIHistory', roiHistorySchema);
