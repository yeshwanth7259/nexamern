const logger = require('../utils/logger');
const { errorResponse } = require('../utils/response');

const errorHandler = (err, req, res, next) => {
  logger.error(err.message, { stack: err.stack });

  // Mongoose duplicate key
  if (err.code === 11000) {
    const message = 'Duplicate field value entered';
    return errorResponse(res, 400, message);
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map(val => val.message).join(', ');
    return errorResponse(res, 400, message);
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return errorResponse(res, 401, 'Invalid token');
  }
  if (err.name === 'TokenExpiredError') {
    return errorResponse(res, 401, 'Token expired');
  }

  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  return errorResponse(res, statusCode, err.message || 'Server Error');
};

module.exports = errorHandler;
