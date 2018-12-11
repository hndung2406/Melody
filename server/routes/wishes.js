//Library import
const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const morgan = require('morgan');
const fs = require('fs');
const multer = require('multer');

//Local import
const Wish = require('../model/wish')

//Middleware for bodyParser
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({     // to support URL-encoded bodies
    extended: true
})); 

// create a write stream (in append mode)
var accessLogStream = fs.createWriteStream('./server.log', { flags: 'a' });

//Middleware for Morgan
router.use(morgan('dev', { stream: accessLogStream }));

//Store and Validation Multer
const multerConf = {
    storage : multer.diskStorage({
        destination : (req, file, cb) => {
            cb(null, './views/images');
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
            cb({message: "File type not supported"}, false); 
        }
    }
};

//GET REQUEST
router.get('/upload', (req, res) => {
    var success = req.query.success;
    res.render('upload.hbs', {
        success: success 
    });
});

router.post('/upload', multer(multerConf).single('photo'), (req, res) => {

    //Convert int to String
    var price = req.body.price.toString();
    
    //If find file
    if(req.file) {
        req.body.photo = req.file.filename;
        //Create path to Image
        var image = "/images/" + req.body.photo;
    }

    //Create new Object Wish
    var wish = new Wish({
        name: req.body.name,
        image: image,
        link: req.body.link,
        price: price,
        description: req.body.desc
    });

    //Save wish to database
    wish.save().then((doc) => {
        //Set success to return query String
        var success = true;
        res.redirect('/wish/upload?success=' + success);
    }, (err) => {
        res.status(400).send(err);
    });
   
});

module.exports = router;