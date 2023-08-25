const mongoose = require('mongoose');
const User = require('./User');
const Question = require('./Question');
const Schema = mongoose.Schema;

const AnswerSchema=new Schema({
    content:{
        type:String,
        required: [true, 'Please provide a content'],
        minlength: [20, 'Pleaseprovide a content at least 20 characters']
    },
    user:{
        type:mongoose.Schema.ObjectId,
        ref:"User",
        required:true
    },
    likes:[
        {
            type:mongoose.Schema.ObjectId,
            ref:"User"
        }
    ],
    question:{
        type:mongoose.Schema.ObjectId,
        ref:"Question"
    },
    createtAt:{
        type:Date,
        default:Date.now()
    }
})

AnswerSchema.pre("save", async function(next){
    if(!this.isModified("user")){
        return next()
    }
    try {
        const question=await Question.findById(this.question)
        question.answers.push(this._id)
        await question.save()
        next()
        
    } catch (err) {
        return next(err)        
    }
    
})

AnswerSchema.pre("deleteOne",{ document: true, query: false }, async function(){
    console.log(this)
    // const answerId=this.getFilter()
    // const answer=await Answer.findById(answerId)
    // console.log("ans",answer)
    // const question=await Question.findById(this.getFilter()._id);
    // question.answers.splice(question.answers.indexOf(answer.question),1)
    // await question.save()

})
module.exports=mongoose.model("Answer",AnswerSchema)



