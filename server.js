var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var config = require('./config');
var app = express();
//get our user models
var User = require('./models/user');
//get our event models
var Event = require('./models/event');

//body-parse the requests
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));
//serve static files from public folder
app.use(express.static('public'));

//Connect to the db
var runServer = function(callback) {
    mongoose.connect(config.MONGODB_URI, function(err) {
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

//NEED TO MAKE THIS ONLY ACCEPT UNIQUE EVENTNAMES

//CREATE SWIM record endpoint
app.post('/user/history', function(req, res) {
    User.findOneAndUpdate(
        {"name" : req.body.name},
        {$push: {
            swim_history: {
                $each: [
                    { eventName: req.body.eventName,
                        eventDate: req.body.eventDate,
                        eventStroke: req.body.eventStroke,
                        eventDistance: req.body.eventDistance,
                        eventTime: req.body.eventTime,
                        eventRank: req.body.eventRank
                    }
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

/*//READ SWIM record endpoint
app.get('/user/history', function(req, res) {
    User.find({
        name : req.body.name,
        swim_history : ['boo']},
        function(err, swim_history) {
            if (err) {
                return res.status(500).json({
                    message: 'Couldnt find swim history...'
                });
            }
            res.status(200).json(swim_history);
        }
        //db.students.find( { score: { $gt: 0, $lt: 2 } } )
        //{ field1: <value>, field2: <value> ... }
    );
});*/


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
            swim_history: { eventName: req.body.eventName }
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