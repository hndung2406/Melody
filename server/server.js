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

//Register partials
hbs.registerPartials(__dirname + '/views/partials');

//Set the view engine for node
app.set('view engine', 'hbs');

//Static folders
app.use("/js",express.static(__dirname + "/views/js"));
app.use("/css", express.static(__dirname + "/views/css"));
app.use(express.static(__dirname + "/images"));

//Middleware for bodyParser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));

//Middleware logging request
app.use((req, res, next) => {
    var now = new Date().toString();
    var log = `${now}: ${req.method}, ${req.url}`;
    console.log(log);
    fs.appendFile('server.log', log + '\n', (err) => {
        if(err) {
            console.log('Unable to append to server.log');
        }
    })
    next();
});

//POST REQUEST
//Add todo
app.post('/add', (req,res) => {
    var todo = new Todo({
        text: req.body.text
    });

    todo.save().then((doc) => {
        var success = true;
        res.redirect('/add?success=' + success);
    }, (err) => {
        res.status(400).send(err);
    });
});

//Update todo
app.post('/update', (req, res) => {
    var completed = null;
    var completedAt = null;

    //Create new select
    if(req.body.completed == "True") {
        completed = true;
    } else {
        completed = false;
    }

    //Create new date
    if(completed == true) {
        completedAt = new Date().getTime();
    }

    Todo.findByIdAndUpdate(req.body.id, {
        $set: {
            text: req.body.text,
            completed: completed,
            completedAt: completedAt
        }
    }, {
        returnOriginal: false
    }).then((todo) => {
        res.redirect('/list');
    }).catch((error) => {
        res.status(400).send(err);
    });

});

//Update todo
app.post('/delete', (req, res) => {
    Todo.findByIdAndRemove(req.body.idDelete).then((todo) => {
        if(!todo) {
            res.status(400).send();
        }
        res.redirect('/list');
    }).catch((error) => {
        res.status(400).send(err);
    });
});

//GET REQUEST
//Add successful
app.get('/add', (req, res) => {
    var success = req.query.success;
    res.render('add.hbs', {
        success: success
    });
});

//Get the list of all todos
app.get('/list', (req, res) => {
    Todo.find({}).then((todos) => {
        res.render('list.hbs', {todos});
    }, (err) => {
        res.status(400).send(err);
    });
});


app.get('/', (req, res) => {
    res.render('home.hbs');
});

app.listen(3000,  () => {
    console.log('Started on port 3000');
});
