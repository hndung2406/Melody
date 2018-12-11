//Library import
const express = require('express');
const hbs = require('hbs');

//Local import
const mongoose = require('./db/mongoose');
const todos = require('./routes/todos');
const wishes = require('./routes/wishes');

//Use express
var app = express();

//Register partials
hbs.registerPartials(__dirname + '/views/partials');

//Set the view engine for node
app.set('view engine', 'hbs');

//Static folders
app.use("/js",express.static(__dirname + "/views/js"));
app.use("/css", express.static(__dirname + "/views/css"));
app.use("/images", express.static(__dirname + "/views/images"));

//Config path for router
app.use('/todo', todos);
app.use('/wish', wishes);

app.get('/', (req, res) => {
    res.render('home.hbs');
});

app.listen(3000,  () => {
    console.log('Started on port 3000');
});