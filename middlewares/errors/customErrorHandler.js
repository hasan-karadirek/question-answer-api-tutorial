const CustomError = require('../../helpers/error/CustomError');

const customErrorHandler = (err, req, res, next) => {
  console.log(err);

  if (err.name === 'ValidationError') {
    customError = new CustomError(err.message, err.status);
  }
  if (err.name === 'MongoServerError') {
    if (err.code === 11000) {
      customError = new CustomError(
        'Duplicate Key found: Please check your input',
        400
      );
    } else {
      customError = new CustomError(err.message, err.status);
    }
  }
  if (err.name === 'CastError') {
    customError = new CustomError('Please provide a correct id!', 400);
  } else {
    customError = err;
    customError.status = 404;
  }

  res.status(customError.status || 500).json({
    success: false,
    message: customError.name + ' : ' + customError || 'Internal Server Error',
  });
};

module.exports = customErrorHandler;
