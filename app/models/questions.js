var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var QuestionSchema = new Schema({
                    question: { type: String, require:true},
                    option1: { type: String, require:true },
                    option2: { type: String, require:true},
                    option3: { type: String, require:true },
                    option4: { type: String, require:true},
                    answer  :{type:String, require:true}
});

module.exports  = mongoose.model('Question', QuestionSchema);