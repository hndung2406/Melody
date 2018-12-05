//Library import
const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const hbs = require('hbs');

//Local import
const {mongoose} = require('./db/mongoose');
const {Todo} = require('./model/todo');
const {User} = require('./model/user');

//Use express
var app = express();

//Set the view engine for node
app.set('view engine', 'hbs');

//Middleware for bodyParser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));

//Middleware logging request
// app.use((req, res, next) => {
//     var now = new Date().toString();
//     var log = `${now}: ${req.method}, ${req.url}`;
//     console.log(log);
//     fs.appendFile('server.log', log + '\n', (err) => {
//         if(err) {
//             console.log('Unable to append to server.log');
//         }
//     })
//     next();
// });

// app.post('/todos', (req, res) => {
//     var todo = new Todo({
//         text: req.body.text
//     });
//
//     todo.save().then((doc) => {
//         res.send(doc);
//     }, (err) => {
//         res.status(400).send(err);
//     });
// });

app.post('/add', (req,res) => {
    var todo = new Todo({
        text: req.body.text
    });

    todo.save().then((doc) => {
        var success = true;
        res.redirect('/?success=' + success);
    }, (err) => {
        res.status(400).send(err);
    });
});

// app.get('/todos', (req, res) => {
//     Todo.find({}).then((todos) => {
//         res.send({todos});
//     }, (err) => {
//         res.status(400).send(err);
//     });
// });

app.get('/list', (req, res) => {
    Todo.find({}).then((todos) => {
        res.render('list.hbs', {
            todos: todos
        });
    }, (err) => {
        res.status(400).send(err);
    });
});

app.get('/', (req, res) => {
    var success = req.query.success;
    res.render('home.hbs', {
        success: success
    });
});

app.listen(3000,  () => {
    console.log('Started on port 3000');
});
