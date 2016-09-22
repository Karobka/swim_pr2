var User = require('../user/user.model');

function Controller() {}

Controller.prototype.login = function(req, res, next) {
    console.log('logging in');
    console.log(req.user);
}


Controller.prototype.create = function(req, res, next) {
    console.log("user create is being hit from the auth.controller file");
    User.create({
        username: req.body.username,
        password: req.body.password
    }, function(err, user) {
        if (err) {
            return next(err);
        }
        req.login(user, function(err) {
            if (err) {
                return next(err);
            }
            return res.redirect("/users")
        });
    });
}

module.exports = Controller.prototype;