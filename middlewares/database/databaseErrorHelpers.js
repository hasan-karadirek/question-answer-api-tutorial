const User = require('../../models/User');
const CustomError = require('../../helpers/error/CustomError');
const asyncHandler = require('express-async-handler');
const Question = require('../../models/Question');
const Answer = require('../../models/Answer');

const checkUserExist = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const user = await User.findById(id);

  if (!user) {
    return next(new CustomError('There is no such user with this id!', 404));
  }
  req.checkedUser = user;
  next();
});

const checkQuestionExist = asyncHandler(async (req, res, next) => {
  const questionId = req.params.id || req.params.questionId;

  const question = await Question.findById(questionId);

  if (!question) {
    return next(
      new CustomError('There is no such question with this id!', 404)
    );
  }

  next();
});

const checkAnswerExist = asyncHandler(async (req, res, next) => {
  const { answerId, questionId } = req.params;
  const answer = await Answer.findById(answerId);
  if (!answer || answer.question != questionId)
    return next(
      new CustomError(
        'There is no answer with that id associated with question id',
        404
      )
    );

  return next();
});

module.exports = { checkUserExist, checkQuestionExist, checkAnswerExist };
