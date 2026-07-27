const express = require('express');
const { getSummary, getRecentTransactions, getChartData, getROIHistory, getWalletChartData, adminRunROI, adminAddFunds } = require('../controllers/dashboard.controller');
const { protect } = require('../middlewares/auth.middleware');

const router = express.Router();

router.use(protect);

router.get('/summary', getSummary);
router.get('/recent', getRecentTransactions);
router.get('/chart', getChartData);
router.get('/roi-history', getROIHistory);
router.get('/wallet-chart', getWalletChartData);
router.post('/admin/run-roi', adminRunROI);
router.post('/admin/add-funds', adminAddFunds);

module.exports = router;
