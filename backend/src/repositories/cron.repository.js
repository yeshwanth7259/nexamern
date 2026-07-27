const CronHistory = require('../models/CronHistory');

class CronRepository {
  async create(cronData) {
    const history = new CronHistory(cronData);
    return history.save();
  }

  async checkExists(jobName, runDate) {
    return CronHistory.findOne({ jobName, runDate, status: 'Completed' });
  }

  async updateStatus(id, updateData) {
    return CronHistory.findByIdAndUpdate(id, updateData, { new: true });
  }
}

module.exports = new CronRepository();
