const CustomError = require('../../helpers/error/CustomError');

const customErrorHandler = (err, req, res, next) => {
  let customErr = err;
  if (err.name === 'ValidationError') {
    customErr = new CustomError(err.message, err.status);
  }
  if (err.name === 'MongoServerError') {
    if (err.code === 11000) {
      customErr = new CustomError(
        'Duplicate Key found: Please check your input',
        400
      );
    } else {
      customErr = new CustomError(err.message, err.status);
    }
  }
  if (err.name === 'CastError') {
    customErr = new CustomError('Please provide a correct id!', 400);
  }
  console.error(customErr);
  res.status(customErr.status || 500).json({
    success: false,
    message: customErr.message || 'Internal Server Error',
  });
};

module.exports = customErrorHandler;
