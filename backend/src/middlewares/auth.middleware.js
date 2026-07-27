const jwt = require('jsonwebtoken');
const userRepository = require('../repositories/user.repository');
const { errorResponse } = require('../utils/response');

exports.protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return errorResponse(res, 401, 'Not authorized to access this route');
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');
    const user = await userRepository.findById(decoded.id);
    
    if (!user) {
      return errorResponse(res, 401, 'User no longer exists');
    }

    if (user.status !== 'Active') {
      return errorResponse(res, 403, 'User account is not active');
    }

    req.user = user;
    next();
  } catch (error) {
    return errorResponse(res, 401, 'Not authorized to access this route');
  }
};
