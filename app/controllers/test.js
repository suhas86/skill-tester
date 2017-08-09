var mongoose = require('mongoose');
var express = require('express');

var testRouter = express.Router();
var testModel = mongoose.model('Test');

var responseGenerator = require('./../../libs/responseGenerator');
var config = require('./../../config/config');
var jwt = require('jwt-simple');
module.exports.controller = function (app) {
    //Authenticate user before accessing APIS(Middleware)
    testRouter.use(function (req, res, next) {
        var token = req.body.token || req.body.query || req.headers['x-access-token'];

        if (token) {
            console.log(token)
            var parted = token.split(' ');
            if (parted.length === 2) {
                var decoded = jwt.decode(parted[1], config.secret);
                req.decoded = decoded;
                next();
            } else {
                var myResponse = responseGenerator.generate(true,
                    "Invalid token", 403, null);
                res.send(myResponse);
            }

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

    })


    app.use('/test', testRouter);
}