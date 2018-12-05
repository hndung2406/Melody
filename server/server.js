//Library import
const express = require('express');
const bodyParser = require('body-parser');

//Local import
const {mongoose} = require('./db/mongoose');
const {Todo} = require('./model/todo');
const {User} = require('./model/user');

var app = express();

//Middleware
app.use(bodyParser.json());

app.post('/todos', (req, res) => {
    var todo = new Todo({
        text: req.body.text
    });

    todo.save().then((doc) => {
        res.send(doc);
    }, (err) => {
        res.status(400).send(err);
    });
});

app.listen(3000,  () => {
    console.log('Started on port 3000');
});
