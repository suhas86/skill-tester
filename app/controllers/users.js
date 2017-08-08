var mongoose = require('mongoose');
var express = require('express');

var userRouter = express.Router();
var userModel = mongoose.model('User');

var responseGenerator = require('./../../libs/responseGenerator');
var config = require('./../../config/config');
var jwt = require('jwt-simple');

module.exports.controller = function (app) {

    userRouter.post('/signup', function (req, res) {
        if (req.body.firstName != undefined && req.body.lastName != undefined &&
            req.body.password != undefined && req.body.email != undefined) {
            var newUser = new userModel({
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                email: req.body.email,
                mobileNumber: req.body.mobileNumber,
                password: req.body.password,
                userType: req.body.userType
            });

            newUser.save(function (err) {
                if (err) {
                    var myResponse = responseGenerator.generate(true,
                        "Oops some went wrong " + err, 500, null);
                    // res.send(myResponse);
                    res.send(myResponse);
                } else {
                    var token = jwt.encode(newUser, config.secret);
                    var myResponse = responseGenerator.generate(false, "",
                        200, newUser);
                    myResponse.token = 'JWT ' + token;
                    /*
                    myMailer.sendMail("Welcome",
                        "Welcome to Ticket Support. Please let us know how can we help you",
                        newUser.email);
                        */
                    res.send(myResponse);

                }
            });
        } else {
            var myResponse = responseGenerator.generate(true,
                "Please enter mandatory fields", 403, null);
            res.send(myResponse);
        }
    });

    //Login Route
    userRouter.post('/login/', function (req, res) {

        if (req.body.email != undefined && req.body.password != undefined) {
            userModel.findOne({
                email: req.body.email
            }, function (err, user) {
                if (err) {
                    var myResponse = responseGenerator.generate(true, "Oops Something Went Wrong " + err,
                        500, null);
                    res.send(myResponse);
                } else if (!user) {
                    var myResponse = responseGenerator.generate(true, "Please check the email provided ",
                        404, null);
                    res.send(myResponse);
                } else {
                    user.comparePassword(req.body.password, function (err, isMatch) {
                        if (isMatch && !err) {
                            // if user is found and password is right create a token
                            var token = jwt.encode(user, config.secret);
                            // return the information including token as JSON
                            var myResponse = responseGenerator.generate(false, "",
                                200, user);
                            myResponse.token = 'JWT ' + token;
                            res.send(myResponse);
                        } else {
                            var myResponse = responseGenerator.generate(true, "Please check your password ",
                                404, null);
                            res.send(myResponse);
                        }
                    });
                }
            })
        } else {
            var myResponse = responseGenerator.generate(true,
                "Please enter mandatory fields", 403, null);
            res.send(myResponse);
        }

    });

    //Get user
    userRouter.use(function(req,res,next){
        var token=req.body.token || req.body.query || req.headers['x-access-token'];

        if(token){
           /* console.log(token)
            var decoded = jwt.decode(token, config.secret);
            console.log(decoded)
            req.decoded = decoded; 
            next();*/
        } else {
            var myResponse = responseGenerator.generate(true,
                "Token not provided", 403, null);
            res.send(myResponse);
        }
    })
    userRouter.post('/profile',function(req,res){
        res.send(req.decoded);
    })
    app.use('/users', userRouter);
}