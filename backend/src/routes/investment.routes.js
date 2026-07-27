const express = require('express');
const { body } = require('express-validator');
const { getPlans, createInvestment, getUserInvestments } = require('../controllers/investment.controller');
const { protect } = require('../middlewares/auth.middleware');
const { validate } = require('../middlewares/validation.middleware');

const router = express.Router();

router.use(protect);

router.get('/plans', getPlans);
router.get('/', getUserInvestments);

router.post(
  '/',
  [
    body('planId').notEmpty().withMessage('Plan ID is required'),
    body('amount').isNumeric().withMessage('Amount must be a number')
  ],
  validate,
  createInvestment
);

module.exports = router;
