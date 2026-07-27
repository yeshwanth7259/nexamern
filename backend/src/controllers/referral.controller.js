const referralService = require('../services/referral.service');
const { successResponse } = require('../utils/response');

exports.getDirectReferrals = async (req, res, next) => {
  try {
    const referrals = await referralService.getDirectReferrals(req.user._id);
    return successResponse(res, 200, 'Direct referrals fetched successfully', referrals);
  } catch (error) {
    next(error);
  }
};

exports.getReferralTree = async (req, res, next) => {
  try {
    const tree = await referralService.getReferralTree(req.user._id);
    return successResponse(res, 200, 'Referral tree fetched successfully', tree);
  } catch (error) {
    next(error);
  }
};

const transactionRepository = require('../repositories/transaction.repository');
exports.getReferralIncome = async (req, res, next) => {
  try {
    const tx = await transactionRepository.findByUserId(req.user._id);
    const incomeTx = tx.filter(t => t.type === 'Level Income');
    return successResponse(res, 200, 'Referral income fetched successfully', incomeTx);
  } catch (error) {
    next(error);
  }
};
