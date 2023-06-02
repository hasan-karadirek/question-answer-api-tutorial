const express= require("express");
const router=express.Router();



const question=require("./question");
const auth=require("./auth");
router.use("/question",question);
router.use("/auth",auth);

router.get("/",(req,res)=>{
    res.status(200)
.json({
    success:true
});
})



module.exports = router;