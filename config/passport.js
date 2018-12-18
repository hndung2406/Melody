//Import library
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');

//Import local
const User = require('../model/user');
const mongoose = require('../config/mongoose');

module.exports = function(passport) {
 
    //Local strategy
    passport.use(new LocalStrategy((email, password, done) => {

        //Match username
        let query = {email : email}
        User.findOne(query, (err, user) => {
            if(err) {
                throw err;
            }
            if(!user) {
                return done(null, false, {message: 'Invalid Username'});
            }

            //Match password
            bcrypt.compare(password, user.password, (err, isMatch) => {
                if(err) {
                    throw err;
                }
                if(isMatch) {
                    return done(null, user);
                } else {
                    return done(null, false, {message: 'Invalid Password'});
                }
            })
        });

    }));

    passport.serializeUser((user, done) => {
        done(null, user.id);
    });
      
    passport.deserializeUser((id, done) => {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });

}