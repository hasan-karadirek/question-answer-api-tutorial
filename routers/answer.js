const express = require('express');
const {
  getAccessToRoute,
  getAnswerOwnerAccess,
} = require('../middlewares/authorization/auth');
const {
  checkAnswerExist,
  checkQuestionExist,
} = require('../middlewares/database/databaseErrorHelpers');
const {
  addAnswerToQuestion,
  getAllAnswersByQuestion,
  getSingleAnswer,
  editAnswer,
  deleteAnswer,
  likeAnswer,
  undoLikeAnswer,
} = require('../controllers/answer');

const router = express.Router({ mergeParams: true });
//Endpoint POST /api/question/:id/answers/ :post an answer to a question {content} .
// returns JSON "{success: true,answer',}
//req.headers should have access token by 'Authorization' keyword
router.post('/', getAccessToRoute, addAnswerToQuestion);
//Endpoint GET /api/question/:id/answers/ :get all answers of a question .
// returns JSON "{count,success: true,data',}
router.get('/', getAllAnswersByQuestion);
//Endpoint GET /api/question/:id/answers/:answerId :get a single answer .
// returns JSON "{success: true,data',}
router.get(
  '/:answerId',
  [checkQuestionExist, checkAnswerExist],
  getSingleAnswer
);
//Endpoint PUT /api/question/:id/answers/:answerId : edit an answer {content} .
// returns JSON "{success: true,answer',}
//req.headers should have access token by 'Authorization' keyword
router.put(
  '/:answerId/edit',
  [
    getAccessToRoute,
    checkQuestionExist,
    checkAnswerExist,
    getAnswerOwnerAccess,
  ],
  editAnswer
);
//Endpoint DELETE /api/question/:id/answers/:answerId/delete :delete an answer  .
// returns JSON "{success: true,message: 'Answer Deleted',',}
//req.headers should have access token by 'Authorization' keyword
router.delete(
  '/:answerId/delete',
  [
    getAccessToRoute,
    checkQuestionExist,
    checkAnswerExist,
    getAnswerOwnerAccess,
  ],
  deleteAnswer
);
//Endpoint GET /api/question/:id/answers/:answerId/like :like an answer  .
// returns JSON "{success: true, message: 'Answer liked'',}
//req.headers should have access token by 'Authorization' keyword
router.get(
  '/:answerId/like',
  [getAccessToRoute, checkQuestionExist, checkAnswerExist],
  likeAnswer
);
//Endpoint GET /api/question/:id/answers/:answerId/undolike :like an answer  .
// returns JSON "{success: true, message: 'Answer undoliked'',}
//req.headers should have access token by 'Authorization' keyword
router.get(
  '/:answerId/undolike',
  [getAccessToRoute, checkQuestionExist, checkAnswerExist],
  undoLikeAnswer
);

module.exports = router;
