const ROIHistory = require('../models/ROIHistory');

class ROIRepository {
  async create(roiData, session) {
    const roi = new ROIHistory(roiData);
    return roi.save({ session });
  }

  async checkExists(investmentId, date) {
    return ROIHistory.findOne({ investmentId, date });
  }

  async findByUserId(userId) {
    return ROIHistory.find({ userId }).sort({ createdAt: -1 });
  }
}

module.exports = new ROIRepository();
