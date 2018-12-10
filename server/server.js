//Library import
const express = require('express');
const hbs = require('hbs');
const multer = require('multer');

//Local import
const mongoose = require('./db/mongoose');
const todos = require('./routes/todos');

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

//Config path for router
app.use('/', todos);

//Store and Validation Multer
const multerConf = {
    storage : multer.diskStorage({
        destination : (req, file, cb) => {
            cb(null, './images');
        },
        filename : (req, file, cb) => {
            const extension = file.mimetype.split('/')[1];
            var convert = req.body.fileName.replace(/\s+/g, '_').toLowerCase();
            cb(null, convert + '.' + extension);
        }
    }),
    fileFilter : (req, file, cb) => {
        if(!file) {
            cb();
        }
        const singleImage = file.mimetype.startsWith('image/');
        if(singleImage) {
            cb(null, true);
        } else {
            cb(message, "File type not supported"); 
        }
    }
};

app.get('/upload', (req, res) => {
    var success = req.query.success;
    console.log(success);
    res.render('upload.hbs', {
        success: success 
    });
});

app.post('/upload', multer(multerConf).single('photo'), (req, res) => {
    //If find file
    if(req.file) {
        req.body.photo = req.file.filename;
    }
    var success = true;
    res.redirect('/upload?success=' + success);
});

app.get('/', (req, res) => {
    res.render('home.hbs');
});

app.listen(3000,  () => {
    console.log('Started on port 3000');
});