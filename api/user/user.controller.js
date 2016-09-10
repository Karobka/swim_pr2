var User = require('./user.model');
function Controller() {}

Controller.prototype.getUsers = function(req, res) {
    User.find({}, function(err, users) {
        if (err) {
            return res.status(500).json({
                message: 'Boom!  Internal Server Error'
            });
        }
        res.status(200).json(users);
    });
}


Controller.prototype.createUser = function(req, res) {
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
}

Controller.prototype.deleteUser = function(req, res) {
    User.findOneAndRemove({
        name: req.body.name
    }, function(err, user) {
        if (err) {
            return res.status(500).json({
                message: 'Cant delete that...'
            });
        }
        res.status(200).json(user);
    });
}

Controller.prototype.addUserEvent = function(req, res) {
    req.params.name = req.body.name;
    User.findOneAndUpdate({
            "name": req.body.name
        }, {
            $push: {
                swim_history: {
                    $each: [{
                        eventName: req.body.eventName,
                        eventDate: req.body.eventDate,
                        eventStroke: req.body.eventStroke,
                        eventDistance: req.body.eventDistance,
                        eventTime: req.body.eventTime,
                        eventRank: req.body.eventRank
                    }]
                }
            }
        }, {
            returnNewDocument: true
        },
        function(err, newswimevent) {
            if (err) {
                return res.status(500).json({
                    message: 'You forgot to plug something in...'
                });
            }
            res.status(201).json(newswimevent);
        }
    );
}

Controller.prototype.deleteUserEvent = function(req, res) {
    req.params.name = req.body.name;
    User.findOneAndUpdate({
            "name": req.body.name
        }, {
            $pull: {
                swim_history: {
                    eventName: req.body.eventName
                }
            }
        },
        function(err, removedevent) {
            if (err) {
                return res.status(500).json({
                    message: 'Cant delete for some reason...'
                });
            }
            res.status(201).json(removedevent);
        }
    );
}

module.exports = Controller.prototype;