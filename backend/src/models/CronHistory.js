const mongoose = require('mongoose');

const cronHistorySchema = new mongoose.Schema({
  jobName: {
    type: String,
    required: true,
    index: true,
  },
  runDate: {
    type: String, // YYYY-MM-DD
    required: true,
  },
  status: {
    type: String,
    enum: ['Running', 'Completed', 'Failed'],
    default: 'Running',
  },
  durationMs: {
    type: Number,
    default: 0,
  },
  recordsProcessed: {
    type: Number,
    default: 0,
  },
  errorLog: {
    type: String,
    default: '',
  },
}, { timestamps: true });

// Prevent duplicate runs on the same date for the same job
cronHistorySchema.index({ jobName: 1, runDate: 1 }, { unique: true });

module.exports = mongoose.model('CronHistory', cronHistorySchema);
