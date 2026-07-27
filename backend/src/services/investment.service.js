const mongoose = require('mongoose');
const investmentRepository = require('../repositories/investment.repository');
const referralService = require('./referral.service');
const walletService = require('./wallet.service');

class InvestmentService {
  async getPlans() {
    return investmentRepository.getPlans();
  }

  async createInvestment(userId, planId, amount) {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const plan = await investmentRepository.getPlanById(planId);
      if (!plan) throw new Error('Investment plan not found');
      if (amount < plan.minAmount || amount > plan.maxAmount) {
        throw new Error(`Amount must be between ${plan.minAmount} and ${plan.maxAmount}`);
      }

      // Calculate end date
      const endDate = new Date();
      endDate.setDate(endDate.getDate() + plan.durationDays);

      // 1. Debit Wallet (Throws error if insufficient balance)
      await walletService.debit(
        userId,
        amount,
        'Investment',
        null, // referenceId will be updated later if needed
        `Investment in ${plan.name} plan`,
        session
      );

      // 2. Create Investment Record
      const investment = await investmentRepository.create({
        userId,
        planId,
        amount,
        endDate,
        dailyROI: plan.dailyROIPercentage
      }, session);

      // 3. Distribute Referral Income
      await referralService.distributeIncome(userId, investment._id, amount, session);

      await session.commitTransaction();
      session.endSession();

      return investment;
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      throw error;
    }
  }

  async getUserInvestments(userId) {
    return investmentRepository.findByUserId(userId);
  }
}

module.exports = new InvestmentService();
