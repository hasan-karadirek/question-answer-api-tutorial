const User = require('../models/User');
const CustomError = require('../helpers/error/CustomError');
const asyncHandler = require('express-async-handler');

const blockUser = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const user = await User.findById(id);

  user.blocked = !user.blocked;

  await user.save();

  return res
    .status(200)
    .json({ success: true, message: 'Block, unblock process is successful' });
});

const deleteUser = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const user = await User.deleteOne({_id:id})


  return res
    .status(200)
    .json({ success: true, message: 'User delete process is successful' });
});

module.exports = { blockUser, deleteUser };
