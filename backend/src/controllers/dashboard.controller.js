const { successResponse } = require('../utils/response');
const investmentRepository = require('../repositories/investment.repository');
const transactionRepository = require('../repositories/transaction.repository');
const roiRepository = require('../repositories/roi.repository');

const roiService = require('../services/roi.service');

exports.getSummary = async (req, res, next) => {
  try {
    const user = req.user;
    const investments = await investmentRepository.findByUserId(user._id);
    const totalInvestmentsAmount = investments.reduce((sum, inv) => sum + inv.amount, 0);

    const data = {
      walletBalance: user.walletBalance,
      totalInvestments: totalInvestmentsAmount,
      totalROIEarned: user.totalROIEarned,
      totalLevelIncome: user.totalLevelIncome,
      activeInvestmentsCount: investments.filter(i => i.status === 'Active').length
    };
    return successResponse(res, 200, 'Dashboard summary fetched', data);
  } catch (error) {
    next(error);
  }
};

exports.getRecentTransactions = async (req, res, next) => {
  try {
    const transactions = await transactionRepository.findByUserId(req.user._id);
    // Limit to top 10 for dashboard
    return successResponse(res, 200, 'Recent transactions fetched', transactions.slice(0, 10));
  } catch (error) {
    next(error);
  }
};

exports.getChartData = async (req, res, next) => {
  try {
    const roiHistory = await roiRepository.findByUserId(req.user._id);
    
    // Aggregate by date
    const aggregated = {};
    roiHistory.forEach(record => {
      if (!aggregated[record.date]) aggregated[record.date] = 0;
      aggregated[record.date] += record.amount;
    });

    const chartData = Object.keys(aggregated).map(date => ({
      date,
      amount: aggregated[date]
    })).sort((a, b) => new Date(a.date) - new Date(b.date)); // Sort chronologically

    return successResponse(res, 200, 'Chart data fetched', chartData);
  } catch (error) {
    next(error);
  }
};

exports.getROIHistory = async (req, res, next) => {
  try {
    const roiHistory = await roiRepository.findByUserId(req.user._id);
    return successResponse(res, 200, 'ROI history fetched', roiHistory);
  } catch (error) {
    next(error);
  }
};

exports.getWalletChartData = async (req, res, next) => {
  try {
    const transactions = await transactionRepository.findByUserId(req.user._id);
    // Transactions are sorted newest first. Reverse to calculate cumulative.
    const ascTransactions = [...transactions].reverse();
    
    const aggregated = {};
    let cumulative = 0;
    ascTransactions.forEach(tx => {
      const date = tx.createdAt.toISOString().split('T')[0];
      cumulative += tx.amount;
      aggregated[date] = cumulative;
    });

    const chartData = Object.keys(aggregated).map(date => ({
      date,
      balance: aggregated[date]
    })).sort((a, b) => new Date(a.date) - new Date(b.date));

    return successResponse(res, 200, 'Wallet chart data fetched', chartData);
  } catch (error) {
    next(error);
  }
};

exports.adminRunROI = async (req, res, next) => {
  try {
    const result = await roiService.processDailyROI();
    return successResponse(res, 200, 'Admin Daily ROI completed', result);
  } catch (error) {
    next(error);
  }
};

const walletService = require('../services/wallet.service');
exports.adminAddFunds = async (req, res, next) => {
  try {
    // Add 10,000 to the wallet for testing purposes
    await walletService.credit(
      req.user._id,
      10000,
      'Deposit',
      null,
      'Test Deposit',
      null,
      false
    );
    return successResponse(res, 200, 'Successfully added ₹10,000 to wallet', { added: 10000 });
  } catch (error) {
    next(error);
  }
};
