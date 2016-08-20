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


/**
 * USER endpoints
 */

//READ USERS endpoint
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

//CREATE USER endpoint
app.post('/users', function(req, res) {
    User.create({
        name: req.body.name,
        swim_history: []
    }, function(err, user) {
        if (err) {
            return res.status(500).json({
                message: 'Kaboom! Internal Server Error'
            });
        }
        res.status(201).json(user);
    });
});

//UPDATE USER endpoint
app.put('/users', function(req, res) {
    User.findOneAndUpdate(
        {"name" : req.body.name},
        {$set: {"name" : req.body.nameupdate}},
        {returnNewDocument : true},
        function(err, userupdate){
            if (err) {
                return res.status(500).json({
                    message: 'Well that didnt work...'
                });
            }
            res.status(201).json(userupdate);
        }
    );
});

//DELETE USER endpoint
app.delete('/users', function(req, res) {
    User.findOneAndRemove({
     name: req.body.name   
    }, function(err, user) {
        if (err) {
            return res.status(500).json({
                message: 'Cant delete that...'
            });
        }
        res.status(201).json(user);
    });
});


/**
 * SWIM record endpoints
 */

//CREATE SWIM record endpoint
app.post('/user/history', function(req, res) {
    User.findOneAndUpdate(
        {"name" : req.body.name},
        {$push: {
            swim_history: {
                $each: [
                    { event: req.body.eventname, stroke: req.body.stroke, time: req.body.time}
                ]
            }
        }
    },
    {returnNewDocument : true},
    function(err, historyupdate) {
        if (err) {
            return res.status(500).json({
                message: 'You oops forgot to plug something in...'
            });
        }
        res.status(201).json(historyupdate);
    }
    );
});


/**UPDATE SWIM record endpoint
app.put('/user/history', function(req, res){
    User.findOneAndUpdate(
        {"name" : req.body.name},

    )
}) */


//DELETE SWIM record endpoint
app.delete('/user/history', function(req, res) {
    User.findOneAndUpdate(
        {"name" : req.body.name},
        {$pull: {
            swim_history: { event: req.body.eventname }
        }},
        function(err, historyupdate) {
            if (err) {
                return res.status(500).json({
                    message: 'Cant delete for some reason...'
                });
            }
            res.status(201).json(historyupdate);
        }
    );
});

//Catch all enpoint
app.use('*', function(req, res) {
    res.status(404).json({
        message: 'Nothing Found.  Youre way off the path.'
    });
});

exports.app = app;
exports.runServer = runServer;