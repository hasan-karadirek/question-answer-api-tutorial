const express= require("express");
const router=express.Router();



const question=require("./question");
const auth=require("./auth");
const admin=require("./admin");
const user=require("./user");
router.use("/admin",admin);
router.use("/question",question);
router.use("/auth",auth);
router.use("/users",user)

router.get("/",(req,res)=>{
    res.status(200)
.json({
    success:true
});
})



module.exports = router;