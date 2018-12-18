const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcrypt = require('bcryptjs');

//Create the schema for User
var userSchema = mongoose.Schema({
    email: {
        type: String,
        required: true,
        trim: true,
        minlength: 1,
        unique: true,
        validate: {
            validator: validator.isEmail,
            message: '{VALUE} is not a valid email'
        }
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    firstname: {
        type: String,
        required: true
    },
    lastname: {
        type: String,
        required: true
    },
    tokens: [{
        access: {
            type: String,
            required: true
        },
        token: {
            type: String,
            required: true
        }
    }]
});

// //Find the user based on email and password
// userSchema.statics.findByCredentials = function(email, password) {
    
//     var user = this;

//     return user.findOne({email}).then((user) => {
//         if(!user) {
//             return Promise.reject();
//         }
//         return new Promise((resolve, reject) => {
//             //Compare password with encrypted one
//             bcrypt.compare(password, user.password, (err, res) => {
//                 if(res) {
//                     resolve(user);
//                 } else {
//                     reject();
//                 }
//             });
//         });
//     });

// } 

//Parse object into JSON
userSchema.methods.toJSON = function() {
    var user = this;
    var userObject = user.toObject();
    return _.pick(userObject, ['_id', 'email']);
};

//Create method generate token
userSchema.methods.generateAuthToken = function() {

    //Setting up user
    var user = this;
    var access = 'auth';
    
    //Create token
    var token = jwt.sign({_id: user._id.toHexString(),access}, 'abc123');
    user.tokens = user.tokens.concat([{access, token}]);

    return user.save().then(() => {
        return token;
    });
};

//Encrypted password into hash code
userSchema.pre('save',function(next) {
    
    //Setting up user
    var user = this;

    //If user is modified 
    if(user.isModified('password')) {

        //Generate bcrypt
        bcrypt.genSalt(10, (err, salt) => {
            if(err) {
                res.status(400).send(err);
            }
            bcrypt.hash(user.password, salt, (err, hash) => {
                if(err) {
                    res.status(400).send(err);
                }
                user.password = hash;
                next();
            });
        });
    } else {
        next();
    }
});

module.exports = mongoose.model('User', userSchema); 
