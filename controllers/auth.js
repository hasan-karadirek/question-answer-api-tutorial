const User = require('../models/user')
const CustomError = require('../helpers/error/CustomError')
const asyncHandler = require('express-async-handler')
const { sendJwtToClient } = require('../helpers/authorization/tokenHelpers')
const {
  validateUserInput,
  comparePassword
} = require('../helpers/input/inputHelpers')
const { sendEmail } = require('../helpers/libraries/sendEmail')

const register = asyncHandler(async (req, res, next) => {
  const { name, email, password, role } = req.body

  const user = await User.create({
    name,
    email,
    password,
    role
  })

  sendJwtToClient(user, res)
})
const getUser = (req, res, next) => {
  return res.status(200).json({
    success: true,
    data: req.user
  })
}
const login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body
  if (!validateUserInput(email, password)) {
    return next(new CustomError('Check your inputs!'), 400)
  }

  const user = await User.findOne({ email }).select('+password')

  if (!comparePassword(password, user.password)) {
    return next(new CustomError('User crediantials'), 400)
  }

  sendJwtToClient(user, res)
})

const logout = asyncHandler(async (req, res, next) => {
  return res
    .status(200)
    .cookie({
      httpOnly: true,
      expires: new Date(Date.now()),
      secure: false
    })
    .json({
      success: true,
      message: 'logged out'
    })
})

const forgotPassword = asyncHandler(async (req, res, next) => {
  const resetEmail = req.body.email
  console.log(resetEmail)
  const user = await User.findOne({ email: resetEmail })
  if (!user) {
    return next(new CustomError('Please provide a correct email', 400))
  }
  const resetPasswordToken = user.getResetPasswordTokenFromUser()

  await user.save()

  const resetPasswordUrl = `http://localhost:5000/api/auth/resetpassword?resetPasswordToken=${resetPasswordToken}`

  const emailTemplate = String.raw`
  <h3>Reset Your Password</h3>
  <p>This <a href=${resetPasswordUrl} target="_blank">link</a> will expire in 1 hour</p>
  `
  console.log("hasan calisti la")
  try {
    await sendEmail({
      from: "hasankaradirek3@gmail.com",
      to: "hasankaradirek3@gmail.com",
      subject: 'Reset Password',
      html: emailTemplate
    })
    return res.status(200)
    .json({
      success:true,
      message:"Mail sent"
    })
    
  } catch (err) {
    user.resetPasswordToken = undefined
    user.resetPasswordExpire = undefined

    await user.save()
    console.log(err)
    return next(new CustomError('Email could not be sent', 500))
  }
});

const resetPassword=asyncHandler(async (req, res, next) => {
  const {resetPasswordToken}=req.query;
  const {password}=req.body;
  if(!resetPasswordToken){
    return next(new CustomError("Invalid Token",400))
  }
  
  let user = await User.findOne({
    resetPasswordToken:resetPasswordToken,
    resetPasswordExpire:{$gt : Date.now()}
  })
  if(!user){
    return next(new CustomError("Invalid Token or Session Expired",404))
  }
  
  user.password=password;
  user.resetPasswordToken=undefined;
  user.resetPasswordExpire=undefined;
  await user.save();

  return res.status(200)
  .json({
    success:true,
    message:"Reset Password Process Successful"
  })

})

const imageUpload = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(
    req.user.id,
    { profileImage: req.savedProfileImage },
    { new: true, runValidators: true }
  )
  return res.status(200).json({
    success: true,
    message: 'upload successful' + req.savedProfileImage,
    data: user
  })
})

module.exports = {
  register,
  login,
  logout,
  forgotPassword,
  getUser,
  imageUpload,
  resetPassword
}
