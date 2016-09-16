var User = require('../user/user.model');
function Controller (){}

Controller.prototype.login = function ( req, res, next ) {
  passport.authenticate('local', {
        successRedirect: '/events',
        failureRedirect: '/login'
    });
}


Controller.prototype.create = function (req, res, next) {
  User.create({
        username: req.username,
        password: req.password
    }, function (err, users) {
        if (err) {
            return next(err);
        }
        res.status(201).json(user);
    });
}

module.exports = Controller.prototype;
