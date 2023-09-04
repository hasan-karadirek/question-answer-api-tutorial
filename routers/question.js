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
//Endpoint GET /api/question/id : get a single question with its answers and pagination of answers.
// returns JSON "{success: true,answerCount,pagination ,data}
//limit&page params can use /api/question/id?page=1&limit=3
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
//Endpoint GET /api/question : get all questions with pagination.
// returns JSON "{success: true,questionCount,pagination ,data}
//limit&page params can use /api/question?page=1&limit=3

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
//Endpoint POST /api/question/ask : ask a question by title and content {title,content}.
// returns JSON "{success: true,question}
//req.headers should have access token by 'Authorization' keyword

router.post('/ask', getAccessToRoute, askNewQuestion);
//Endpoint PUT /api/question/:id/edit : edit a question by its id.
// returns JSON "{success: true,question}
//req.headers should have access token by 'Authorization' keyword
router.put(
  '/:id/edit',
  [getAccessToRoute, checkQuestionExist, getQuestionOwnerAccess],
  editQuestion
);
//Endpoint GET /api/question/:id/like : like a question .
// returns JSON "{success: true,question}
//req.headers should have access token by 'Authorization' keyword
router.get('/:id/like', [getAccessToRoute, checkQuestionExist], likeQuestion);
//Endpoint GET /api/question/:id/undolike : undolike a question .
// returns JSON "{success: true,question}
//req.headers should have access token by 'Authorization' keyword
router.get(
  '/:id/undolike',
  [getAccessToRoute, checkQuestionExist],
  undoLikeQuestion
);
//Endpoint DELETE /api/question/:id/delete : delete a question .
// returns JSON "{success: true,message: 'Question is deleted',}
//req.headers should have access token by 'Authorization' keyword
router.delete(
  '/:id/delete',
  [getAccessToRoute, checkQuestionExist, getQuestionOwnerAccess],
  deleteQuestion
);

router.use('/:questionId/answers', checkQuestionExist, answer);
module.exports = router;
