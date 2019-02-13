const mongoose = require('mongoose');
const url = 'mongodb://mongo:27017/TodoApp';

mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGODB_URI || url, { useNewUrlParser: true });
mongoose.set('useCreateIndex', true);

module.exports = {
    mongoose: mongoose
};
