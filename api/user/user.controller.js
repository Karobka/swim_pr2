var User = require('./user.model');
var app = require('express');
function Controller() {}


Controller.prototype.getUsers = function (req, res, next) {
  User.find({}, function (err, users) {
    if (err) {
      return next(err);
      /*return res.status(500).json({
        message: 'Boom!  Internal Server Error'
      });*/
    }
    res.status(200).json(users);
  });
}

Controller.prototype.createUser = function (req, res, next) {
  User.create({
    username: req.body.name,
    /*swim_history: []*/
  }, function (err, user) {
    if (err) {
      return next(err);
      /*return res.status(500).json({
        message: 'Kaboom! Internal Server Error'
      });*/
    }
    res.status(201).json(user);
  });
}

Controller.prototype.createSwimr = function ( req, res, next) {
  User.findOneAndUpdate({
    username: req.body.username
  }, {
    $push: {
      swimrsarray: {
        swimrName: req.body.swimr_name
      }
    }
  }, function (err, newSwimr) {
    if (err) {
      return next(err);
    }
    res.status(201).json(newSimr);
  })
}

Controller.prototype.deleteSwimr = function (req, res, next) {
  User.findOneAndRemove({
    name: req.body.name
  }, function (err, user) {
    if (err) {
      return next(err);
      /*return res.status(500).json({
        message: 'Cant delete that...'
      });*/
    }
    res.status(200).json(user);
  });
}

Controller.prototype.addSwimrEvent = function (req, res, next) {
  req.params.name = req.body.name;
  User.findOneAndUpdate({
    name: req.body.name
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
    function (err, newswimevent) {
      if (err) {
        return next(err);
        /*return res.status(500).json({
          message: 'You forgot to plug something in...'
        });*/
      }
      res.status(201).json(newswimevent);
    }
  );
}

Controller.prototype.deleteSwimrEvent = function (req, res, next) {
  console.log(User);
  console.log(req.body.name);
  console.log("event name is " + req.body.eventName);
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
    function (err, removedevent) {
      if (err) {
        return next(err);
        /*return res.status(500).json({
          message: 'Cant delete for some reason...'
        });*/
      }
      res.status(201).json(removedevent);
    }
  );
}

module.exports = Controller.prototype;