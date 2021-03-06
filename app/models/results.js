var mongoose=require('mongoose');
var Schema=mongoose.Schema;

var resultSchema=new Schema({
     userId: {type: String, required:true},
        testIds: {type: String, required:true},
        testName:{type:String,default:'Not available'},
        takenAt:{type:Date,default:Date.now()},
        testScore: {type: Number,default: 0},
        timeTaken: {type: Number,default: 0},
        correctAnswers: {type: Number,default: 0},
        wrongAnswers: {type: Number,default: 0}
});

module.exports=mongoose.model('Results',resultSchema);