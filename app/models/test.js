var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var TestSchema=new Schema({
      name: {type: String, required: true},
      category: {type: String},
      totalScore: {type: Number,default: 100},
      totalQuestions: {type: Number,default: 10},
      description: {type: String},
      duration: {type: Number,default: 20},
      createdBy:{type:String,default:''},
      questions: [],
      testAtemptedBy:[]

})

 module.exports = mongoose.model('Test', TestSchema);