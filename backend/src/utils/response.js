exports.successResponse = (res, statusCode, message, data = {}) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};

exports.errorResponse = (res, statusCode, message, errors = []) => {
  return res.status(statusCode).json({
    success: false,
    message,
    errors,
  });
};
