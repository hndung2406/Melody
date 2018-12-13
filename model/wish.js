const mongoose = require('mongoose');

var wishSchema = mongoose.Schema({
    name: {
        type: String,
        require: true,
        minlength: 1,
        trim: true
    },
    image: {
        type: String,
        require: true,
        trim: true
    },
    link: {
        type: String,
        require: true,
        trim: true
    },
    price: {
        type: String,
        require: true,
        trim: true
    },
    description: {
        type: String,
        require: false,
        trim: true
    }
});

module.exports = mongoose.model('Wish', wishSchema);