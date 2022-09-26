const express = require('express');
const app = express();
const port = 3000;
const bodyParser = require('body-parser');
const passport = require('passport');
const flash = require('connect-flash');
const cookieParser = require('cookie-parser');
const session = require('express-session');

// connect to database
const mongoose = require('mongoose');
// username, password and database redacted for security reasons, uncomment and add database data if in use
// mongoose.connect('mongodb+srv://[USERNAMEREDACTED]:[PASSWORDREDACTED]@[DATABASEREDACTED]?retryWrites=true&w=majority', {useNewUrlParser: true, useUnifiedTopology: true});
require('./controller/passport')(passport);

// set up express
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true} ));

// set up view engine
app.set('view engine', 'ejs');
app.use(express.static('public'));

// required for passport
app.use(session({ secret: 'ilovescotchscotchyscotchscotch',
    resave: false,
    saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

// routes
require('./routes/routes')(app, passport);
app.listen(port, () => console.log(`Listening on port ${port}`));
