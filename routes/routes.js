var menu = require('./menu');
var submit = require('./submit');
var search = require('./search');
// var result = require('./result');
// var bulk = require('./bulk');

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {
    // authenticated users get to carry on
    if (req.isAuthenticated())
        return next();
    // others are redirected to the login page
    res.redirect('/login');
}

module.exports = function(app, passport) {
    // show home page
    app.get('/', isLoggedIn, menu);

    // show signup form
    app.get('/signup', function(req, res) {
        res.render('signup', { message: req.flash('signupMessage') });    
    });

    // process signup form
    app.post('/signup', passport.authenticate('local-signup', {
        successRedirect : '/',
        failureRedirect : '/signup',
        failureFlash : true
    }));

    // show the login form
    app.get('/login', function(req, res) {
        res.render('login', { message: req.flash('loginMessage') });
    });

    // process the login form
    app.post('/login', passport.authenticate('local-login', {
        successRedirect : '/',
        failureRedirect : '/login',
        failureFlash : true
    }));

    // show data submittal form
    app.get('/submit', isLoggedIn, function(req, res) {
        res.render('submit');
    });

    // process data submittal form
    app.post('/submit', isLoggedIn, submit);

    // show data query page
    app.get('/search', isLoggedIn,
        search
        // function(req, res) {
        //     res.render('search');
        // }
    );

    // process data query and show results
    // app.post('/results', isLoggedIn, result);

    // logout
    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/login');
    });

    // app.get('/bulk', bulk);

    // route all other requests to 404 page
    app.all('*', function(req, res) {
        res.render('404');
    });
};