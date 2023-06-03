const customErrorHandler=(err,req,res,next)=>{
    console.log(err.message,err.status);
    res.status(400).json({ success: false });
}; 

module.exports = customErrorHandler;