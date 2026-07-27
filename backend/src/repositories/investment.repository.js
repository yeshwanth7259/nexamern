const Investment = require('../models/Investment');
const InvestmentPlan = require('../models/InvestmentPlan');

class InvestmentRepository {
  async getPlans() {
    return InvestmentPlan.find({ status: 'Active' });
  }

  async getPlanById(id) {
    return InvestmentPlan.findById(id);
  }

  async create(investmentData, session) {
    const investment = new Investment(investmentData);
    return investment.save({ session });
  }

  async findByUserId(userId) {
    return Investment.find({ userId }).populate('planId');
  }

  async getActiveInvestments() {
    return Investment.find({ status: 'Active' });
  }
}

module.exports = new InvestmentRepository();
