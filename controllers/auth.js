const User = require("../models/user");
const CustomError=require("../helpers/error/CustomError");

const register = async (req, res) => {
  const { name, email, password } = {
    name: "HasanK",
    email: "hasankaradirek3@gmail.com",
    password: "123qwe123",
  };
  try{
    const user = await User.create({
        name,
        email,
        password,
      });
    
      res.status(200).json({
        success: true,
        data: user,
      });
    }
    catch(err){return next(err)};
  }
  
  
const errorTest=(req,res,next)=>{
    return next(new CustomError("CustomError",400))
}
module.exports = {
  register,
  errorTest
};
