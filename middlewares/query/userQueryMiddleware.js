const User = require("../../models/User");
const { searchHelper, paginationHelper } = require("./queryMiddlewareHelpers");
const asyncHandler = require('express-async-handler');

const userQueryMiddleware= function(model,options){
    return asyncHandler(async function(req,res,next){
        let query =model.find();

        query=searchHelper("name",query,req)
        
        const paginationResults=await paginationHelper(User,query,req);
        query=paginationResults.query;
        
        const pagination=paginationResults.pagination;
        const queryResults=await query;
        res.queryResults={
            success:true,
            count:paginationResults.total,
            pagination:pagination,
            data:queryResults
        }
        next()

    })
}

module.exports=userQueryMiddleware;