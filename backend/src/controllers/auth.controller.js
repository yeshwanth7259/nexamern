const authService = require('../services/auth.service');
const { successResponse } = require('../utils/response');

exports.register = async (req, res, next) => {
  try {
    const user = await authService.register(req.body);
    return successResponse(res, 201, 'User registered successfully', user);
  } catch (error) {
    if (error.message === 'Email already registered' || error.message === 'Invalid referral code') {
      res.status(400);
    }
    next(error);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const data = await authService.login(email, password);
    return successResponse(res, 200, 'Login successful', data);
  } catch (error) {
    if (error.message === 'Invalid credentials') {
      res.status(401);
    }
    next(error);
  }
};
