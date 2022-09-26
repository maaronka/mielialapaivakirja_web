var localStrategy = require('passport-local').Strategy;
var User = require('../model/user');

module.exports = function(passport) {
    // passport session setup, required for persistent login sessions
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user){
            done(err, user);
        });
    });

    // local signup
    passport.use('local-signup', new localStrategy({
        usernameField: 'username',
        passwordField: 'password',
        passReqToCallback: true
    },
    function(req, username, password, done) {
        User.findOne({ 'local.username' : username }, function(err, user){
            if(err) return done(err);

            if(user){
                return done(null, false, req.flash('signupMessage', 'Käyttäjätunnus ei kelpaa'));
            } else {
                // create new user with credentials and hash the password
                var newUser = new User();
                newUser.local.username = username;
                newUser.local.password = newUser.generateHash(password);
                newUser.save(function(err) {
                    if(err) throw err;
                    return done(null, newUser);
                });
            }
        });
    }));

    // local login
    passport.use('local-login', new localStrategy({
        usernameField: 'username',
        passwordField: 'password',
        passReqToCallback: true
    },
    function(req, username, password, done) {
        User.findOne({ 'local.username' : username }, function(err, user) {
            // if there are any errors, stop and return error
            if (err) return done(err);
            // if username or password are wrong, return flash message
            if (!user || !user.validPassword(password))
                return done(null, false, req.flash('loginMessage', 'Käyttäjä tai salasana väärä'));
            // all is well, return successful user
            return done(null, user);
        });
    }));
};