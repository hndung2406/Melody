const mongoose = require('mongoose');
const url = 'mongodb://localhost:27017/TodoApp';

mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGODB_URI || url, { useNewUrlParser: true });

module.exports = {
    mongoose: mongoose
};
