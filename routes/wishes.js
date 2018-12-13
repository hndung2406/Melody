//Library import
const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const morgan = require('morgan');
const fs = require('fs');
const multer = require('multer');

//Local import
const Wish = require('../model/wish');

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
//Render upload page
router.get('/upload', (req, res) => {
    var success = req.query.success;
    res.render('upload.hbs', {
        success: success 
    });
});

//Render wish list page
router.get('/wishes', (req, res) => {
    Wish.find({}).sort({name: 1}).then((wishes) => {
        res.render('list.hbs', {wishes});
    }, (err) => {
        res.status(400).send(err);
    });
});

//POST REQUEST
//upload using multer
router.post('/upload', multer(multerConf).single('photo'), (req, res) => {

    //Convert int to String
    var price = req.body.price + "$";
    
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

//Update using multer
router.post('/update', multer(multerConf).single('photo'), (req, res) => {

    var price = req.body.price + "$";

    //If find file
    if(req.file) {
        req.body.photo = req.file.filename;
        //Create path to Image
        var image = "/images/" + req.body.photo;
        Wish.findByIdAndUpdate(req.body.id, {
            $set: {
                name: req.body.text,
                image: image,
                link: req.body.link,
                price: price,
                description: req.body.description
            }
        }, {
            returnOriginal: false
        }).then((wish) => {
            res.redirect('/wish/wishes');
        }).catch((err) => {
            res.status(400).send(err);
        })
    } else {
        Wish.findByIdAndUpdate(req.body.id, {
            $set: {
                name: req.body.text,
                link: req.body.link,
                price: price,
                description: req.body.description
            }
        }, {
            returnOriginal: false
        }).then((wish) => {
            res.redirect('/wish/wishes');
        }).catch((err) => {
            res.status(400).send(err);
        })
    }
});

router.post('/delete', (req, res) => {
    Wish.findByIdAndRemove(req.body.idDelete).then((wish) => {
        if(!wish) {
            res.status(400).send();
        }
        res.redirect('/wish/wishes');
    }).catch((err) => {
        res.status(400).send(err);
    });
});

module.exports = router;