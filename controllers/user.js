const User = require('../models/User');
const asyncHandler = require('express-async-handler');

const getSingleUser = asyncHandler(async (req, res, next) => {
  const user = req.checkedUser;

  return res.status(200).json({
    success: true,
    data: user,
  });
});

const getAllUsers = asyncHandler(async (req, res, next) => {
  return res.status(200).json(res.queryResults);
});
module.exports = { getSingleUser, getAllUsers };
