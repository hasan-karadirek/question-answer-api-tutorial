const mongoose=require("mongoose");
const connectDatabase= () => {
    mongoose.connect(process.env.MONGO_URI,{})
    .then(()=>{
        console.log("MangoDB Connection Successful")
    })
    .catch(()=>{
        console.error(err);
    })
};

module.exports=connectDatabase;
