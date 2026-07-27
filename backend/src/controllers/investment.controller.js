const investmentService = require('../services/investment.service');
const { successResponse } = require('../utils/response');

exports.getPlans = async (req, res, next) => {
  try {
    const plans = await investmentService.getPlans();
    return successResponse(res, 200, 'Investment plans fetched successfully', plans);
  } catch (error) {
    next(error);
  }
};

exports.createInvestment = async (req, res, next) => {
  try {
    const { planId, amount } = req.body;
    const investment = await investmentService.createInvestment(req.user._id, planId, amount);
    return successResponse(res, 201, 'Investment created successfully', investment);
  } catch (error) {
    if (error.message === 'Insufficient wallet balance' || error.message.includes('Amount must be')) {
      res.status(400);
    }
    next(error);
  }
};

exports.getUserInvestments = async (req, res, next) => {
  try {
    const investments = await investmentService.getUserInvestments(req.user._id);
    return successResponse(res, 200, 'Investments fetched successfully', investments);
  } catch (error) {
    next(error);
  }
};
