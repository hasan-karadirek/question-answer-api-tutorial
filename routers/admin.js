const express = require('express');
const router = express.Router();
const {
  getAccessToRoute,
  getAccessToAdmin,
} = require('../middlewares/authorization/auth');
const {
  checkUserExist,
} = require('../middlewares/database/databaseErrorHelpers');
const { blockUser, deleteUser } = require('../controllers/admin');

router.use([getAccessToRoute, getAccessToAdmin]);
router.get('/block/:id', checkUserExist, blockUser);
router.delete('/user/:id', checkUserExist, deleteUser);

module.exports = router;
