var User = require('./user.model');
var swimrEvent = require('../event/event.model');
var Swimr = require('../swimr/swimr.model');
var app = require('express');
function Controller() {}


Controller.prototype.getSwimrs = function (req, res, next) {
  console.log("Congrats you made it to the getSwimrs route.");
  Swimr.find({
    user_id: req.user._id
  }, function (err, swimrs) {
    if (err) {
      return next(err);
    }
    res.status(201).json(swimrs);
  });
}

/*User.findOne({user_id: req.user.id})
swimmers.find({user_id: req.user.id})*/


Controller.prototype.createSwimr = function ( req, res, next) {
  console.log("youre hitting the createswimr route");
  console.log(req.user._id);
  console.log(req.body.swimr_name);
  Swimr.create({
    user_id: req.user._id,
    swimr_name: req.body.swimr_name
  }, function (err, newSwimr) {
    if (err) {
      return next(err);
    }
    res.status(201).json(newSwimr);
  });
}

Controller.prototype.deleteSwimr = function (req, res, next) {
  Swimr.findOneAndRemove({
      user_id: req.user._id,
      swimr_name: req.body.swimr_name
    }, function (err, swimr) {
    if (err) {
      return next(err);
    }
    res.status(200).json(swimr);
  });
}

Controller.prototype.addSwimrEvent = function (req, res, next) {
  //console.log(req);
  swimrEvent.create({
    user_id: req.user._id,
    swimr_name: req.body.swimr_name,
    eventName: req.body.eventName,
    eventDate: req.body.eventDate,
    eventStroke: req.body.eventStroke,
    eventDistance: req.body.eventDistance,
    eventTime: req.body.eventTime,
    eventRank: req.body.eventRank
  },
    function (err, newswimevent) {
      if (err) {
        console.log("mongoose model errors " + err.errors);
        return next(err);
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