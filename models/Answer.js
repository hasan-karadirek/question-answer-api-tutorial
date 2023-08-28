const mongoose = require('mongoose');
const Question = require('./Question');
const Schema = mongoose.Schema;

const AnswerSchema=new Schema({
    content:{
        type:String,
        required: [true, 'Please provide a content'],
        minlength: [20, 'Please provide a content at least 20 characters']
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
    
    const question = await Question.findById(this.question)
    question.answers.splice(question.answers.indexOf(this._id),1)
    question.answerCount=question.answerCount-1;
    await question.save()

})
module.exports=mongoose.model("Answer",AnswerSchema)



