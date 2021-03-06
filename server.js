//Library import
const express = require('express');
const hbs = require('hbs');
const passport = require('passport');
const session = require('express-session')

//Local import
const mongoose = require('./config/mongoose');
const todos = require('./routes/todos');
const wishes = require('./routes/wishes');
const users = require('./routes/users');

//Port constant
const port = process.env.PORT || 3000;

//Use express
var app = express();

//Register partials
hbs.registerPartials(__dirname + '/views/partials');

//Set the view engine for node
app.set('view engine', 'hbs');

//Static folders
app.use("/js", express.static(__dirname + "/views/js"));
app.use("/css", express.static(__dirname + "/views/css"));
app.use("/images", express.static(__dirname + "/views/images"));
app.use("/library", express.static(__dirname + "/library"));

//Session middleware
app.use(session({
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: true
}))

//Config for passport
require('./config/passport')(passport);
app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
    app.locals.user = req.user;
    next();
});

//Config path for router
app.use('/todo', todos);
app.use('/wish', wishes);
app.use('/user', users);

app.get('/', (req, res) => {
    res.render('home.hbs');
});

app.listen(port, () => {
    console.log('Started on port ' + port);
});