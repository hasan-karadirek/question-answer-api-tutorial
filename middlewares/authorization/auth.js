const jwt=require("jsonwebtoken")
const { isTokenIncluded,getAccessTokenFromHeader } = require("../../helpers/authorization/tokenHelpers")
const{JWT_SECRET_KEY}=process.env;
const CustomError = require("../../helpers/error/CustomError");
const getAccessToRoute=(req,res,next)=>{
    if(!isTokenIncluded(req)){
        next(new CustomError("No authorization",401) )
    }
    const token=getAccessTokenFromHeader(req)
    console.log(token,"hstokeen")
    jwt.verify(token,JWT_SECRET_KEY,(err,decoded)=>{
        if(err) next(new CustomError("Unauthorizated",401));
        req.user={
            id:decoded.id,
            name:decoded.name
        }
        next()
    })
}
module.exports={getAccessToRoute}