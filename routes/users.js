//Library import
const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const morgan = require('morgan');
const fs = require('fs');
const passport = require('passport');

//Local import
const User = require('../model/user');

//Middleware for bodyParser
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ // to support URL-encoded bodies
    extended: true
}));

//Create a write stream (in append mode)
var accessLogStream = fs.createWriteStream('./server.log', {
    flags: 'a'
});

//Middleware for Morgan 
router.use(morgan('dev', {
    stream: accessLogStream
}));

//GET REQUEST
//Register page
router.get('/register', (req, res) => {
    //Get the query string
    var error = req.query.error;
    var success = req.query.success;

    //Render the front end
    res.render('register.hbs', {
        error: error,
        success: success
    });
})

//Login page
router.get('/login', (req, res) => {
    if(req.query.error === "Invalid Username") {
        var errorname = true;
        res.render('login.hbs', {
            errorname: errorname
        });
    } else if(req.query.error === "Invalid Password") {
        var errorpassword = true;
        res.render('login.hbs', {
            errorpassword: errorpassword
        });
    } else {
        res.render('login.hbs');
    }
});

//Logout method
router.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/user/login');
});



//POST REQUEST
//Post request for register
router.post('/register', (req, res) => {

    //If password doesn't match
    if (req.body.password != req.body.repassword) {
        var error = true;
        res.redirect('/user/register?error=' + error);
    } else {

        //If password matches
        //Get the user model
        var user = new User({
            email: req.body.email,
            password: req.body.password,
            firstname: req.body.firstname,
            lastname: req.body.lastname
        })

        //save it to database
        user.save().then(() => {
            return user.generateAuthToken();
        }).then((token) => {
            var success = true;
            res.header('x-auth', token).redirect('/user/register?success=' + success);
            // res.header('x-auth', token).send(user);
        }).catch((err) => {
            res.status(400).send(err);
        });
    }

});

//Post request for login
router.post('/login', (req, res, next) => {
    passport.authenticate('local', function (err, user, info) {
        if (err) {
            return next(err);
        }
        if (!user) {
            return res.redirect('/user/login?error=' + info.message);
        }
        req.logIn(user, function (err) {
            if (err) {
                return next(err);
            }
            return res.redirect('/');
        });
    })(req, res, next);
});

module.exports = router;