const express = require('express');
const { getDirectReferrals, getReferralTree, getReferralIncome } = require('../controllers/referral.controller');
const { protect } = require('../middlewares/auth.middleware');

const router = express.Router();

router.use(protect);

router.get('/direct', getDirectReferrals);
router.get('/tree', getReferralTree);
router.get('/income', getReferralIncome);

module.exports = router;
