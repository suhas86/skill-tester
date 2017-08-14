var mongoose=require('mongoose');
var Schema=mongoose.Schema;

var answerSchema=new Schema({
    userId:{type:String,required:true},
    testId:{type:String,required:true},
    questionId:{type:String,required:true},
    creationDate:{type:Date,default:Date.now()},
    givenAnswer:{type:String,required:true},
    correctAnswer:{type:String,required:true},
    timeTaken:{type:String}
});

module.exports  = mongoose.model('Answers', answerSchema);