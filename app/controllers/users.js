var mongoose = require('mongoose');
var express = require('express');

var userRouter = express.Router();
var userModel = mongoose.model('User');

var responseGenerator = require('./../../libs/responseGenerator');
var config = require('./../../config/config');
var jwt = require('jwt-simple');
var passjwt = require('jsonwebtoken');
var nodemailer = require('nodemailer');

module.exports.controller = function (app) {
    var client = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'abc@gmail.com', // Your email address
            pass: '123' // Your password
        },
        tls: {
            rejectUnauthorized: false
        }
    });
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
                    myResponse.token = token;
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
                            myResponse.token = token;
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

    //Forgot Password Link generate
    userRouter.post('/forgot-password', function (req, res) {
        userModel.findOne({
            email: req.body.email
        }).select('email firstName').exec(function (err, user) {
            if (err) {
                var myResponse = responseGenerator.generate(true, "Oops Something Went Wrong " + err,
                    500, null);
                res.send(myResponse);
            } else if (!user) {
                var myResponse = responseGenerator.generate(true, "Email not found",
                    404, null);
                res.send(myResponse);
            } else {
                user.passwordToken = passjwt.sign({
                    firstName: user.firstName,
                    email: user.email
                }, config.secret, {
                    expiresIn: '24h'
                });
                // var token = jwt.encode(user, config.secret);
                user.save(function (err) {
                    if (err) {
                        var myResponse = responseGenerator.generate(true, "Oops Something Went Wrong " + err,
                            500, null);
                        res.send(myResponse);
                    } else {
                        console.log(user);
                        // Create e-mail object to send to user
                        var email = {
                            from: 'Skill Tester, murthy.suhas@gmail.com',
                            to: user.email,
                            subject: 'Reset Password Request',
                            text: 'Hello ' + user.firstName + ', You recently request a password reset link. Please click on the link below to reset your password:<br><br><a href="https://young-shore-27367.herokuapp.com/#/reset/' + user.passwordToken,
                            html: 'Hello<strong> ' + user.firstName + '</strong>,<br><br>You recently request a password reset link. Please click on the link below to reset your password:<br><br><a href="https://young-shore-27367.herokuapp.com/#/reset/' + user.passwordToken + '">https://young-shore-27367.herokuapp.com/#/reset/</a>'
                        };
                        // Function to send e-mail to the user
                        client.sendMail(email, function (err, info) {
                            if (err) {
                                console.log(err); // If error with sending e-mail, log to console/terminal
                            } else {
                                console.log(info); // Log success message to console
                                console.log('sent to: ' + user.email); // Log e-mail 
                            }
                        });
                        var myResponse = responseGenerator.generate(false, "Instructions has been sent to you E-Mail",
                            200, null);
                        res.send(myResponse);
                    }
                });
            }
        });
    });

    //Verify for token
    userRouter.get('/reset-password/:token', function (req, res) {
        userModel.findOne({
                passwordToken: req.params.token
            }).select()
            .exec(function (err, user) {
                if (err) {
                    var myResponse = responseGenerator.generate(true, "Oops Something Went Wrong " + err,
                        500, null);
                    res.send(myResponse);
                } else {
                    var token = req.params.token;
                    passjwt.verify(token, config.secret, function (err, decoded) {
                        if (err) {
                            var myResponse = responseGenerator.generate(true, "Password link has expired",
                                500, null);
                            res.send(myResponse);
                        } else {
                            if (!user) {
                                var myResponse = responseGenerator.generate(true, "Password link has expired",
                                    500, null);
                                res.send(myResponse);
                            } else {
                                var myResponse = responseGenerator.generate(false, "",
                                    200, user);
                                res.send(myResponse);
                            }
                        }
                    })
                }
            })
    });

    //Save new password
    userRouter.post('/reset-password', function (req, res) {
        userModel.findOne({
                _id: req.body.id
            })
            .select('firstName email password passwordToken').exec(function (err, user) {
                if (err) {
                    var myResponse = responseGenerator.generate(true, "Oops Something Went Wrong " + err,
                        500, null);
                    res.send(myResponse);
                } else {
                    user.password = req.body.password;
                    user.passwordToken = false;
                    user.save(function (err) {
                        if (err) {
                            var myResponse = responseGenerator.generate(true, "Oops Something Went Wrong " + err,
                                500, null);
                            res.send(myResponse);
                        } else {
                            var myResponse = responseGenerator.generate(false, "Password has been updated successfully.Please login",
                                200, null);
                            res.send(myResponse);
                        }
                    })

                }
            })
    })

    //User Auth Middleware
    userRouter.use(function (req, res, next) {
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
    })
    userRouter.post('/profile', function (req, res) {
        res.send(req.decoded);
    })

    userRouter.put('/update/profile/:id',function(req,res){
        userModel.findByIdAndUpdate({_id:req.params.id},req.body, {
                new: true
            },function(err,user){
                if (err) {
                var myResponse = responseGenerator.generate(true, "Oops Something Went Wrong " + err,
                    500, null);
                res.send(myResponse);
            } else {
                var token = jwt.encode(user, config.secret);
                var myResponse = responseGenerator.generate(false, "",
                    200, user);
                myResponse.token=token;    
                res.send(myResponse);
            }
            })
    })

    /*************** ADMIN APIS ******************************************************************/

    //Get user list
    userRouter.get('/all', function (req, res) {
        userModel.find({
            userType: 2
        }, function (err, response) {
            if (err) {
                var myResponse = responseGenerator.generate(true, "Oops Something Went Wrong " + err,
                    500, null);
                res.send(myResponse);
            } else {
                var myResponse = responseGenerator.generate(false, "",
                    200, response);
                res.send(myResponse);
            }
        })
    })
    app.use('/users', userRouter);
}