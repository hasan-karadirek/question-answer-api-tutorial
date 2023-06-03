const mongoose=require("mongoose");
const Schema=mongoose.Schema;

const UserSchema = new Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type : String,
        required:true,
        unique:[true,"try another email"],
    },
    role:{
        type:String,
        default:"user",
        enum:["user","admin"]
    },
    password:{
        type:String,
        minlength:[6,"Please enter a valid password"],
        required:[true,"please enter a valid password"],
        select:false

    },
    createdAt:{
        type:Date,
        default:Date.now,
    },
    title:{type:String},
    about:{type:String},
    place:{type:String},
    website:{type:String},
    profileImage:{
        type:String,
        default:"default.jpg"
    },
    blocked:{
        type:Boolean,
    default:false
    },
})
module.exports =mongoose.model("User",UserSchema);