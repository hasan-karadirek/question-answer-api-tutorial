const express = require('express');
const router = express.Router();
const answer = require('./answer');
const {
  askNewQuestion,
  getAllQuestions,
  getSingleQuestion,
  editQuestion,
  deleteQuestion,
  likeQuestion,
  undoLikeQuestion,
} = require('../controllers/question');
const {
  getAccessToRoute,
  getQuestionOwnerAccess,
} = require('../middlewares/authorization/auth');
const {
  checkQuestionExist,
} = require('../middlewares/database/databaseErrorHelpers');
const Question = require('../models/Question');
const questionQueryMiddleware = require('../middlewares/query/questionQueryMiddleware');
const answerQueryMiddleware = require('../middlewares/query/answerQueryMiddleware');

router.get(
  '/:id',
  checkQuestionExist,
  answerQueryMiddleware(Question, {
    population: [
      {
        path: 'user',
        select: 'name profile_image',
      },
      {
        path: 'answers',
        select: 'content',
        populate: {
          path: 'user',
          select: 'name',
        },
      },
    ],
  }),
  getSingleQuestion
);

router.get(
  '/',
  questionQueryMiddleware(Question, {
    population: {
      path: 'user',
      select: 'name profile_image',
    },
  }),
  getAllQuestions
);

router.post('/ask', getAccessToRoute, askNewQuestion);
router.put(
  '/:id/edit',
  [getAccessToRoute, checkQuestionExist, getQuestionOwnerAccess],
  editQuestion
);
router.get('/:id/like', [getAccessToRoute, checkQuestionExist], likeQuestion);
router.get(
  '/:id/undolike',
  [getAccessToRoute, checkQuestionExist],
  undoLikeQuestion
);
router.delete(
  '/:id/delete',
  [getAccessToRoute, checkQuestionExist, getQuestionOwnerAccess],
  deleteQuestion
);

router.use('/:questionId/answers', checkQuestionExist, answer);
module.exports = router;
