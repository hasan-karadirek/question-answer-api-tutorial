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
//Endpoint GET /api/admin/block/:id : block single user by its id.
// returns JSON "{ success: true, message: 'Block, unblock process is successful' }"
router.get('/block/:id', checkUserExist, blockUser);
//Endpoint DELETE /api/admin/block/:id : delete single user by its id.
// returns JSON "{ success: true, message: 'User delete process is successful' }"
router.delete('/user/:id', checkUserExist, deleteUser);

module.exports = router;
