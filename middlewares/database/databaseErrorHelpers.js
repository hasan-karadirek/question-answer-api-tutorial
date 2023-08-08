const User = require('../../models/User');
const CustomError = require('../../helpers/error/CustomError');
const asyncHandler = require('express-async-handler');
const Question = require('../../models/Question');

const checkUserExist = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const user = await User.findById(id);

  if (!user) {
    return next(new CustomError('There is no such user with this id!', 400));
  }
  req.dataUser = user;
  next();
});

const checkQuestionExist = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const question = await Question.findById(id);

  if (!question) {
    return next(
      new CustomError('There is no such question with this id!', 400)
    );
  }

  next();
});

module.exports = { checkUserExist, checkQuestionExist };
