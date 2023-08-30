const bcrypt = require('bcryptjs');
const User = require('../../models/User.js');
const CustomError = require('../error/CustomError.js');
const validateUserRegisterInput = async (req, next) => {
  const { name, email, password } = req.body;
  if (!(name && email && password)) {
    return next(
      new CustomError(
        'Please provide all the required fields for this request.',
        400
      )
    );
  }
  const user = await User.findOne({ email });

  if (user) {
    return next(
      new CustomError(
        'The provided email is already registered. Please use a different email address.',
        400
      )
    );
  }
  return user;
};
const validateUserLoginInput = async (req, next) => {
  const { email, password } = req.body;
  if (!(email && password)) {
    return next(
      new CustomError(
        'Please provide all the required fields for this request.',
        400
      )
    );
  }

  const user = await User.findOne({ email }).select('+password');
  const hashedPassword = user.password;
  if (!user || !comparePassword(password, hashedPassword)) {
    return next(
      new CustomError(
        'Invalid username or password. Please check your credentials.',
        401
      )
    );
  }

  return user;
};
const comparePassword = (password, hashedPassword) => {
  return bcrypt.compareSync(password, hashedPassword);
};

module.exports = {
  validateUserRegisterInput,
  validateUserLoginInput,
  comparePassword,
};
