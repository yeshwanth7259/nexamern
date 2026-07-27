const express = require('express');
const { body } = require('express-validator');
const { register, login } = require('../controllers/auth.controller');
const { validate } = require('../middlewares/validation.middleware');

const router = express.Router();

router.post(
  '/register',
  [
    body('fullName').notEmpty().withMessage('Full name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('mobile').notEmpty().withMessage('Mobile number is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    body('referredByCode').optional().isString()
  ],
  validate,
  register
);

router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').notEmpty().withMessage('Password is required')
  ],
  validate,
  login
);

module.exports = router;
