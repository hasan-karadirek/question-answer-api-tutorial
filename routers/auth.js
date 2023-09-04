const express = require('express');
const router = express.Router();
const {
  register,
  getUser,
  login,
  logout,
  imageUpload,
  forgotPassword,
  resetPassword,
} = require('../controllers/auth');
const { getAccessToRoute } = require('../middlewares/authorization/auth');
const {
  profileImageUpload,
} = require('../middlewares/libraries/profileImageUpload');
//Endpoint POST /api/auth/register : register a user by {email,password,name}.
// returns JSON "{success: true,access_token: token,data,data: { username, email ,userId}"
//add cookies 'access_token'
router.post('/register', register);
//Endpoint POST /api/auth/login : login user by {email,password}.
// returns JSON "{success: true,access_token: token,data,data: { username, email ,userId}"
router.post('/login', login);
//Endpoint POST /api/auth/forgotpassword : request reset password link by email  {email}.
// returns JSON "{success: true,message: 'Mail sent',}
router.post('/forgotpassword', forgotPassword);
//Endpoint POST /api/auth/upload : add profile image  by file.
// returns JSON "{success: true,message: 'upload successful',data: user});
router.post(
  '/upload',
  [getAccessToRoute, profileImageUpload.single('profile_image')],
  imageUpload
);
//Endpoint GET /api/auth/logout : Logout.
// returns JSON "{success: true,message: 'logged out',}
router.get('/logout', getAccessToRoute, logout);
//Endpoint GET /api/auth/profile : get profile infos.
// returns JSON "{success: true,data: user})
router.get('/profile', getAccessToRoute, getUser);
//Endpoint PUT /api/auth/resetpassword : reset users by token from queries.
// returns JSON "{success: true,data: user})

router.put('/resetpassword', resetPassword);
module.exports = router;
