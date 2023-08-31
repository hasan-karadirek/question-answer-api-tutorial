const User = require('../models/User');
const CustomError = require('../helpers/error/CustomError');
const asyncHandler = require('express-async-handler');
const {
  validateUserRegisterInput,
  validateUserLoginInput,
} = require('../helpers/input/inputHelpers');
const { sendEmail } = require('../helpers/libraries/sendEmail');

const register = asyncHandler(async (req, res, next) => {
  await validateUserRegisterInput(req, next);
  const { name, email, password } = req.body;

  const user = await User.create({
    name,
    email,
    password,
  });
  const { JWT_COOKIE } = process.env;
  const token = await user.generateJwtFromUser();
  return res
    .status(201)
    .cookie('access_token', token, {
      httpOnly: true,
      expires: new Date(Date.now() + parseInt(JWT_COOKIE) * 1000 * 60),
      secure: false,
    })
    .json({
      success: true,
      access_token: token,
      data: { user: user.name, email: user.email },
    });
});
const getUser = (req, res, next) => {
  return res.status(200).json({
    success: true,
    data: req.user,
  });
};
const login = asyncHandler(async (req, res, next) => {
  const user = await validateUserLoginInput(req, next);
  const { JWT_COOKIE } = process.env;
  const token = user.generateJwtFromUser();
  console.log(token, typeof token, 'tokenafa');
  return res
    .status(200)
    .cookie('access_token', token, {
      httpOnly: true,
      expires: new Date(Date.now() + parseInt(JWT_COOKIE) * 1000 * 60),
      secure: false,
    })
    .json({
      success: true,
      access_token: token,
      data: { user: user.name, email: user.email },
    });
});

const logout = asyncHandler(async (req, res, next) => {
  return res
    .status(200)
    .cookie('access_token', '', {
      httpOnly: true,
      expires: new Date(Date.now()),
      secure: false,
    })
    .json({
      success: true,
      message: 'logged out',
    });
});

const forgotPassword = asyncHandler(async (req, res, next) => {
  const resetEmail = req.body.email;

  const user = await User.findOne({ email: resetEmail });
  if (!user) {
    return next(new CustomError('Please provide a correct email', 404));
  }
  const resetPasswordToken = user.getResetPasswordTokenFromUser();

  await user.save();

  const resetPasswordUrl = `http://localhost:5000/api/auth/resetpassword?resetPasswordToken=${resetPasswordToken}`;

  const emailTemplate = String.raw`
  <h3>Reset Your Password</h3>
  <p>This <a href=${resetPasswordUrl} target="_blank">link</a> will expire in 1 hour</p>
  `;

  try {
    await sendEmail({
      from: process.env.SMTP_USER,
      to: user.email,
      subject: 'Reset Password',
      html: emailTemplate,
    });
    return res.status(200).json({
      success: true,
      message: 'Mail sent',
    });
  } catch (err) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    return next(new CustomError('Email could not be sent', 500));
  }
});

const resetPassword = asyncHandler(async (req, res, next) => {
  const { resetPasswordToken } = req.query;
  const { password } = req.body;
  if (!resetPasswordToken) {
    return next(
      new CustomError(
        'Please provide a valid token in your request params',
        401
      )
    );
  }

  let user = await User.findOne({
    resetPasswordToken: resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    return next(new CustomError('Invalid Token or Session Expired', 401));
  }

  user.password = password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();

  return res.status(200).json({
    success: true,
    message: 'Reset Password Process Successful',
  });
});

const imageUpload = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(
    req.user.id,
    { profileImage: req.savedProfileImage },
    { new: true, runValidators: true }
  );
  return res.status(200).json({
    success: true,
    message: 'upload successful' + req.savedProfileImage,
    data: user,
  });
});

module.exports = {
  register,
  login,
  logout,
  forgotPassword,
  getUser,
  imageUpload,
  resetPassword,
};
