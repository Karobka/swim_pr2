var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var config = require('./config');
var app = express();

//body-parse the requests
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));
//serve static files from public folder
app.use(express.static('public'));

//Connect to the db
var runServer = function(callback) {
    mongoose.connect(config.DATABASE_URL, function(err) {
        if (err && callback) {
            return callback(err);
        }

        app.listen(config.PORT, function() {
            console.log('Listening on localhost:' + config.PORT);
            if (callback) {
                callback();
            }
        });
    });
};

if (require.main === module) {
    runServer(function(err) {
        if (err) {
            console.error(err);
        }
    });
};



//get our user models
var User = require('./models/user');

//READ endpoint
app.get('/users', function(req, res) {
    User.find({},function(err, users) {
        if (err) {
            return res.status(500).json({
                message: 'Boom!  Internal Server Error'
            });
        }
        res.status(200).json(users);
    });
});

//CREATE endpoint
app.post('/users', function(req, res) {
    User.create({
        name: req.body.name
    }, function(err, user) {
        if (err) {
            return res.status(500).json({
                message: 'Kaboom! Internal Server Error'
            });
        }
        res.status(201).json(user);
    });
});


//Catch all enpoint
app.use('*', function(req, res) {
    res.status(404).json({
        message: 'Nothing Found.  Youre way off the path.'
    });
});

exports.app = app;
exports.runServer = runServer;