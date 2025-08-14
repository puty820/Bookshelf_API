const successResponse = (res, status, message, data) => {
  const response = { status: 'success' };
  if (message) response.message = message;
  if (data) response.data = data;
  return res.status(status).json(response);
};

const errorResponse = (res, status, message) => {
  return res.status(status).json({
    status: 'fail',
    message
  });
};

module.exports = { successResponse, errorResponse };