const User=require("../models/user")
const asyncHandler = require('express-async-handler')

const getSingleUser=asyncHandler(async (req, res, next) => {
    
    const user=req.dataUser;

    
    return res.status(200)
    .json({
        success:true,
        data:user
})
})

const getAllUsers=asyncHandler(async (req, res, next) => {
    const users=await User.find()
    return res.status(200)
    .json({
        success:true,
        users:users
    })
})
module.exports={getSingleUser,getAllUsers}