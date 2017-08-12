var FacebookStrategy = require('passport-facebook').Strategy;
var User = require('../app/models/users')
var session = require('express-session');
var config = require('../config/config');
var jwt = require('jwt-simple');
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

module.exports = function (app, passport) {

    app.use(passport.initialize());
    app.use(passport.session());
    app.use(session({
        secret: 'keyboard cat',
        resave: false,
        saveUninitialized: true,
        cookie: {
            secure: false
        }
    }))

    passport.serializeUser(function (user, done) {
        token = jwt.encode(user, config.secret);
        done(null, user.id);
    });

    passport.deserializeUser(function (id, done) {
        User.findById(id, function (err, user) {
            done(err, user);
        });
    });

    passport.use(new FacebookStrategy({
        clientID: '429610624105495',
        clientSecret: '4cd3fb0accd09370b2c8fc2ec26fbac1',
        callbackURL: "http://localhost:3000/auth/facebook/callback",
        profileFields: ['email']
    },
        function (accessToken, refreshToken, profile, done) {
            User.findOne({
                email: profile._json.email
            }, function (err, user) {
                if (err) {
                    done(err);
                }
                if (!user) {
                    user = new User({
                        email: profile.emails[0].value,
                        provider: 'facebook',
                    });
                    user.save(function (err) {
                        if (err) console.log(err);
                        return done(err, user);
                    });
                } else {
                    done(null, user);
                }

            });
            console.log("Profile ", profile._json.email);
            //   done(null, profile);
        }
    ));

    app.get('/auth/facebook/callback',
        passport.authenticate('facebook', {
            failureRedirect: '/login'
        }),
        function (req, res) {
            res.redirect('/#/facebook/' + token)
        });


    app.get('/auth/facebook',
        passport.authenticate('facebook', {
            scope: 'email'
        })
    );

    // Google Strategy  
    passport.use(new GoogleStrategy({
        clientID: '996994656492-o121j79gk0g2vjhe52g6fqmel80l6tii.apps.googleusercontent.com',
        clientSecret: 'Dcvbt0m48RbqVxMBi7T9uHjB', 
        callbackURL: "http://localhost:3000/auth/google/callback" 
    },
        function (accessToken, refreshToken, profile, done) {
            User.findOne({
                email:  profile.emails[0].value 
            }, function (err, user) {
                if (err) {
                    done(err);
                }
                if (!user) {
                    user = new User({
                        email: profile.emails[0].value,
                        provider: 'facebook',
                    });
                    user.save(function (err) {
                        if (err) console.log(err);
                        return done(err, user);
                    });
                } else {
                    done(null, user);
                }

            });
            console.log("Profile ", profile._json.email);
            //   done(null, profile);
        }
    ));

    // Google Routes    
    app.get('/auth/google', passport.authenticate('google', { scope: ['https://www.googleapis.com/auth/plus.login', 'profile', 'email'] }));
    app.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/googleerror' }), function (req, res) {
        res.redirect('/#/google/' + token); // Redirect user with newly assigned token
    });

    return passport;
}