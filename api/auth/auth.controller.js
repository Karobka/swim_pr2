var User = require('../user/user.model');

function Controller() {}

Controller.prototype.login = function(req, res, next) {
    console.log('logging in')
    console.log(req.user);
}


Controller.prototype.create = function(req, res, next) {
    User.create({
        username: req.body.username,
        password: req.body.password
    }, function(err, user) {
        if (err) {
            return next(err);
        }
        res.status(201).json(user);
    });
}

module.exports = Controller.prototype;