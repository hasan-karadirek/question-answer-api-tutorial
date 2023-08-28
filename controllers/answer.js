const Question = require('../models/Question');
const CustomError = require('../helpers/error/CustomError');
const asyncHandler = require('express-async-handler');
const Answer = require('../models/Answer');

const addAnswerToQuestion = asyncHandler(async (req, res, next) => {
  const { questionId } = req.params;
  const { content } = req.body;
  const answer = await Answer.create({
    content: content,
    question: questionId,
    user: req.user.id,
  });

  return res.status(200).json({
    success: true,
    data: answer,
  });
});

const getAllAnswersByQuestion = asyncHandler(async (req, res, next) => {
  const { questionId } = req.params;
  const question = await Question.findById(questionId).populate('answers');
  const answers = question.answers;

  return res.status(200).json({
    count: answers.length,
    success: true,
    data: answers,
  });
});

const getSingleAnswer = asyncHandler(async (req, res, next) => {
  const { answerId } = req.params;
  const answer = await Answer.findById(answerId)
    .populate('user')
    .populate('question');

  return res.status(200).json({
    success: true,
    data: answer,
  });
});

const editAnswer = asyncHandler(async (req, res, next) => {
  const { answerId } = req.params;
  const { content } = req.body;
  const answer = await Answer.findById(answerId);
  answer.content = content;
  const updatedAnswer = await answer.save();
  return res.status(201).json({
    success: true,
    data: updatedAnswer,
  });
});

const deleteAnswer = asyncHandler(async (req, res, next) => {
  const { answerId } = req.params;
  const answer = await Answer.findById(answerId);
  await answer.deleteOne();
  return res.status(201).json({
    success: true,
    message: 'Answer Deleted',
  });
});

const likeAnswer = asyncHandler(async (req, res, next) => {
  const { answerId } = req.params;
  const userId = req.user.id;
  const answer = await Answer.findById(answerId);
  if (answer.likes.includes(userId)) {
    return next(new CustomError('You have already liked this answer'), 401);
  }
  answer.likes.push(userId);
  await answer.save();
  return res.status(200).json({
    success: true,
    message: 'Answer liked',
  });
});

const undoLikeAnswer = asyncHandler(async (req, res, next) => {
  const { answerId } = req.params;
  const userId = req.user.id;
  const answer = await Answer.findById(answerId);
  if (!answer.likes.includes(userId)) {
    return next(new CustomError('You did not like before this answer'), 401);
  }
  answer.likes.splice(answer.likes.indexOf(userId), 1);
  await answer.save();
  return res.status(200).json({
    success: true,
    message: 'Answer undoliked',
  });
});

module.exports = {
  addAnswerToQuestion,
  getAllAnswersByQuestion,
  getSingleAnswer,
  editAnswer,
  deleteAnswer,
  likeAnswer,
  undoLikeAnswer,
};
