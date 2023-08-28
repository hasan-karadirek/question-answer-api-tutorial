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

router.post('/', getAccessToRoute, addAnswerToQuestion);
router.get('/', getAllAnswersByQuestion);
router.get(
  '/:answerId',
  [checkQuestionExist, checkAnswerExist],
  getSingleAnswer
);
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
router.get(
  '/:answerId/like',
  [getAccessToRoute, checkQuestionExist, checkAnswerExist],
  likeAnswer
);
router.get(
  '/:answerId/undolike',
  [getAccessToRoute, checkQuestionExist, checkAnswerExist],
  undoLikeAnswer
);

module.exports = router;
