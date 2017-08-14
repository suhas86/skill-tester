var mongoose = require('mongoose');
var express = require('express');

var testRouter = express.Router();
var testModel = mongoose.model('Test');
var questionModel = mongoose.model('Question');
var answerModel = mongoose.model('Answers');
var resultModel = mongoose.model('Results');


var responseGenerator = require('./../../libs/responseGenerator');
var config = require('./../../config/config');
var jwt = require('jwt-simple');
// Load the full build. 
var _ = require('lodash');
module.exports.controller = function (app) {
    //Authenticate user before accessing APIS(Middleware)
    testRouter.use(function (req, res, next) {
        var token = req.body.token || req.body.query || req.headers['x-access-token'];

        if (token) {
            var decoded = jwt.decode(token, config.secret);
            req.decoded = decoded;
            next();

        } else {
            var myResponse = responseGenerator.generate(true,
                "Token not provided", 403, null);
            res.send(myResponse);
        }
    });
    /*************** ADMIN APIS ******************************************************************/
    //Create Test
    testRouter.post('/admin/create', function (req, res) {
        var newTest = new testModel({
            name: req.body.name,
            category: req.body.category,
            description: req.body.description,
            createdBy: req.decoded._id,
        });

        newTest.save(function (err) {
            if (err) {
                var myResponse = responseGenerator.generate(true,
                    "Oops some went wrong " + err, 500, null);
                res.send(myResponse);
            } else {
                var myResponse = responseGenerator.generate(false, "",
                    200, newTest);
            }
            res.send(myResponse);
        })

    });

    //get all tests
    testRouter.get('/admin/all', function (req, res) {
        testModel.find({}).sort({
            'createdAt': 'desc'
        }).exec(function (err, response) {
            if (err) {
                var myResponse = responseGenerator.generate(true,
                    "Oops some went wrong " + err, 500, null);
                // res.send(myResponse);
                res.send(myResponse);
            } else {
                var myResponse = responseGenerator.generate(false, "",
                    200, response);
                res.send(myResponse);
            }
        })

    });

    //Get Test by ID
    testRouter.get('/single/:id', function (req, res) {
        testModel.findOne({
            _id: req.params.id
        }, function (err, response) {
            if (err) {
                var myResponse = responseGenerator.generate(true,
                    "Oops some went wrong " + err, 500, null);
                // res.send(myResponse);
                res.send(myResponse);
            } else if (response == null || response == undefined) {
                var myResponse = responseGenerator.generate(true,
                    "This test doesnt exists", 404, null);
                // res.send(myResponse);
                res.send(myResponse);
            } else {
                var myResponse = responseGenerator.generate(false, "",
                    200, response);
                res.send(myResponse);
            }
        })
    });

    //Update Test
    testRouter.put('/admin/update/:id', function (req, res) {
        testModel.findByIdAndUpdate({
            _id: req.params.id
        }, req.body, {
                new: true
            }, function (err, response) {
                if (err) {
                    var myResponse = responseGenerator.generate(true,
                        "Oops some went wrong " + err, 500, null);
                    res.send(myResponse);
                } else {
                    var myResponse = responseGenerator.generate(false, "",
                        200, response);
                    res.send(myResponse);
                }
            })
    });

    //Delete Test
    testRouter.get('/delete/:id', function (req, res) {
        testModel.findByIdAndRemove({
            _id: req.params.id
        }, function (err, response) {
            if (err) {
                var myResponse = responseGenerator.generate(true,
                    "Oops some went wrong " + err, 500, null);
                res.send(myResponse);
            } else if (response == null || response == undefined) {
                var myResponse = responseGenerator.generate(true,
                    "Test record not found ", 404, null);
                res.send(myResponse);
            } else {
                var myResponse = responseGenerator.generate(false, "",
                    200, response);
                res.send(myResponse);
            }
        })
    });

    //Create question
    testRouter.post('/createquestion', function (req, res) {

        var question = new questionModel({
            question: req.body.question,
            option1: req.body.option1,
            option2: req.body.option2,
            option3: req.body.option3,
            option4: req.body.option4,
            answer: req.body.answer
        });

        testModel.findById({
            _id: req.body.test_id
        }, function (err, test) {
            if (err) {
                var myResponse = responseGenerator.generate(true,
                    "Oops some went wrong " + err, 500, null);
                res.send(myResponse);
            } else if (test.questions.length == 10) {
                var myResponse = responseGenerator.generate(true,
                    "Maximum question limit has been reached", 500, null);
                res.send(myResponse);
            } else {
                question.save(function (err) {
                    if (err) {
                        var myResponse = responseGenerator.generate(true,
                            "Oops some went wrong " + err, 500, null);
                        res.send(myResponse);
                    } else {
                        test.questions.push(question);
                        test.save(function (err, response) {
                            if (err) {
                                var myResponse = responseGenerator.generate(true,
                                    "Oops some went wrong " + err, 500, null);
                                res.send(myResponse);
                            } else if (question == null || question == undefined) {
                                var myResponse = responseGenerator.generate(true,
                                    "Oops some went wrong ", 500, null);
                                res.send(myResponse);
                            } else {
                                var myResponse = responseGenerator.generate(false, "",
                                    200, response);
                                res.send(myResponse);
                            }
                        })
                    }
                })
            }
        })
    });

    //To get questions
    /*testRouter.get('/question/:id',function(req,res){

    })*/

    //Update question
    testRouter.put('/updatequestion/:test_id', function (req, res) {
        questionModel.findByIdAndUpdate({
            _id: req.body._id
        }, req.body, {
                new: true
            }, function (err, question) {
                if (err) {
                    var myResponse = responseGenerator.generate(true,
                        "Oops some went wrong " + err, 500, null);
                    res.send(myResponse);
                } else {
                    //On updating question model update test model
                    testModel.findById({
                        _id: req.params.test_id
                    }, function (err, test) {
                        if (err) {
                            var myResponse = responseGenerator.generate(true,
                                "Oops some went wrong " + err, 500, null);
                            res.send(myResponse);
                        } else {

                            console.log("Question ID", question._id)
                            var index = _.findIndex(test.questions, {
                                _id: question._id
                            });
                            //  var index = _.findIndex(test.questions, function(obj){ return _.has(obj, question._id)});
                            console.log("Index ", index);
                            test.questions.splice(index, 1);

                            var temp = new questionModel(req.body);
                            test.questions.push(temp);
                            test.save(function (err, response) {
                                if (err) {
                                    var myResponse = responseGenerator.generate(true,
                                        "Oops some went wrong " + err, 500, null);
                                    res.send(myResponse);
                                } else {
                                    var myResponse = responseGenerator.generate(false, "",
                                        200, response);
                                    res.send(myResponse);
                                }
                            })
                        }
                    })
                }
            })
    })
    //Delete question

    testRouter.get('/deleteQuestion/:test_id/:quest_id', function (req, res) {
        testModel.findOne({ _id: req.params.test_id }, function (err, test) {
            if (err) {
                var myResponse = responseGenerator.generate(true,
                    "Oops some went wrong " + err, 500, null);
                res.send(myResponse);
            } else {
                if (test.questions.length == 0) {
                    var myResponse = responseGenerator.generate(true,
                        "No question associated with this test", 404, null);
                    res.send(myResponse);
                } else {
                    questionModel.findByIdAndRemove(req.params.quest_id, function (err, resp) {
                        console.log(resp);
                        console.log(test)
                        var index = _.findIndex(test.questions, {
                            _id: resp._id
                        });
                        //  var index = _.findIndex(test.questions, function(obj){ return _.has(obj, question._id)});
                        console.log("Index ", index);
                        test.questions.splice(index, 1);
                        test.save(function (err, question) {
                            if (err) {
                                var myResponse = responseGenerator.generate(true,
                                    "Oops some went wrong " + err, 500, null);
                                res.send(myResponse);
                            } else {
                                var myResponse = responseGenerator.generate(false, "Question has been deleted successfully!!!", 200, question);
                                res.send(myResponse);
                            }
                        });
                    })

                }

            }
        });
    })

    //Get Test based on User Id
    testRouter.get('/userresult/:id', function (req, res) {
        var id = req.params.id;
        var query = {};
        if (id == 1) {
            query = {}
        } else {
            query = { userId: id }
        }

        resultModel.find(query, function (err, response) {
            if (err) {
                var myResponse = responseGenerator.generate(true,
                    "Oops some went wrong " + err, 500, null);
                res.send(myResponse);
            } else {
                var myResponse = responseGenerator.generate(false, "",
                    200, response);
                res.send(myResponse);
            }
        })
    });

    /****** User Test APIS **************************/

    //Save Answer
    testRouter.post('/saveanswer', function (req, res) {
        var ans = req.body;
        console.log(ans);
        ans.userId = req.decoded._id;
        var n = ans.timeTaken.toString();
        answer = new answerModel({
            userId: ans.userId,
            testId: ans.testId,
            questionId: ans.questionId,
            givenAnswer: ans.givenAnswer,
            correctAnswer: ans.correctAnswer,
            timeTaken: n,
        });
        answer.save(function (err, response) {
            if (err) {
                var myResponse = responseGenerator.generate(true,
                    "Oops some went wrong " + err, 500, null);
                res.send(myResponse);
            } else {
                var myResponse = responseGenerator.generate(false, "",
                    200, response);
                res.send(myResponse);
            }
        })
    });

    //Save Test
    testRouter.post('/savetest', function (req, res) {
        var test = req.body;
        test.userId = req.decoded._id;
        result = new resultModel(test);
        result.save(function (err, response) {
            if (err) {
                var myResponse = responseGenerator.generate(true,
                    "Oops some went wrong " + err, 500, null);
                res.send(myResponse);
            } else {
                //update test attempted
                console.log(req.body.testIds);
                testModel.findByIdAndUpdate({
                    _id: test.testIds
                }, {
                        $push: {
                            testAtemptedBy: test.userId
                        }
                    }, function (err, testAttempted) {
                        if (err) {
                            var myResponse = responseGenerator.generate(true,
                                "Oops some went wrong " + err, 500, null);
                            res.send(myResponse);
                        } else if (testAttempted == null || testAttempted == undefined) {
                            var myResponse = responseGenerator.generate(true,
                                "This test doesnt exists", 404, null);
                            res.send(myResponse);
                        } else {
                            var myResponse = responseGenerator.generate(false, "",
                                200, response);
                            res.send(myResponse);
                        }
                    })
            }
        });
    });

    //Get user stats
    testRouter.get('/stats', function (req, res) {
        var userId = req.decoded._id;
        //Get results from result model
        resultModel.find({
            userId: userId
        }, function (err, response) {
            if (err) {
                var myResponse = responseGenerator.generate(true,
                    "Oops some went wrong " + err, 500, null);
                res.send(myResponse);
            } else {
                var myResponse = responseGenerator.generate(false, "",
                    200, response);
                res.send(myResponse);
            }
        })
    });

    //Get single test result based on user and Result id
    testRouter.get('/single/result/:id', function (req, res) {
        var userId = req.decoded._id;
        var resultId = req.params.id;

        resultModel.findOne({ $and: [{ _id: resultId }, { userId: userId }] }, function (err, response) {
            if (err) {
                var myResponse = responseGenerator.generate(true,
                    "Oops some went wrong " + err, 500, null);
                res.send(myResponse);
            } else {
                var myResponse = responseGenerator.generate(false, "",
                    200, response);
                res.send(myResponse);
            }
        });
    })

    app.use('/test', testRouter);
}