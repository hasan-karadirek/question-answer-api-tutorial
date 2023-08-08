const jwt=require("jsonwebtoken")
const { isTokenIncluded,getAccessTokenFromHeader } = require("../../helpers/authorization/tokenHelpers")
const{JWT_SECRET_KEY}=process.env;
const CustomError = require("../../helpers/error/CustomError");
const asyncHandler = require('express-async-handler')
const User=require("../../models/user")



const getAccessToRoute=(req,res,next)=>{
    if(!isTokenIncluded(req)){
        next(new CustomError("No authorization",401) )
    }
    const token=getAccessTokenFromHeader(req)
    
    jwt.verify(token,JWT_SECRET_KEY,(err,decoded)=>{
        
        if(err) return next(new CustomError("Unauthorizated",401));
        req.user={
            id:decoded.id,
            name:decoded.name
        }
        next()
    })
}
const getAccessToAdmin=asyncHandler(async (req, res, next) => {
    const {id}=req.user;
    const user=await User.findById(id)
    if(user.role !== "admin"){
        return next(new CustomError("You do not have access to this route",403))
    }
    next()
})

module.exports={
    getAccessToRoute,
    getAccessToAdmin
}