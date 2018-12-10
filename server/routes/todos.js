//Library import
const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const morgan = require('morgan');
const fs = require('fs');
const path = require('path')

//Local import
const Todo = require('../model/todo');

//Middleware for bodyParser
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));

// create a write stream (in append mode)
var accessLogStream = fs.createWriteStream('./server', { flags: 'a' });

//Middleware for Morgan
router.use(morgan('dev', { stream: accessLogStream }));

//GET REQUEST
//Add successful
router.get('/add', (req, res) => {
    var success = req.query.success;
    res.render('add.hbs', {
        success: success
    });
});

//Get the list of all todos
router.get('/list', (req, res) => {
    Todo.find({}).then((todos) => {
        res.render('list.hbs', {todos});
    }, (err) => {
        res.status(400).send(err);
    });
});

//POST REQUEST
//Add todo
router.post('/add', (req,res) => {
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
router.post('/update', (req, res) => {
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

//Delete todo
router.post('/delete', (req, res) => {
    Todo.findByIdAndRemove(req.body.idDelete).then((todo) => {
        if(!todo) {
            res.status(400).send();
        }
        res.redirect('/list');
    }).catch((error) => {
        res.status(400).send(err);
    });
});

module.exports = router;