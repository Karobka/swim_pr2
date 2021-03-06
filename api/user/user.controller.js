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

Controller.prototype.getSwimrEvents = function (req, res, next) {
  console.log("This is the getSwimrsEvents route.");
  //console.log(req);
  swimrEvent.find({
    user_id: req.user._id,
    swimr_name: req.params.name
  }, function (err, swimrevents) {
    if (err) {
      return next(err);
    }
    console.log("this should be found events " + swimrevents);
    res.status(201).json(swimrevents);
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
  swimrEvent.findOneAndRemove({
    user_id: req.user._id,
    swimr_name: req.body.swimr_name,
    eventName: req.body.eventName
  }, function (err, removed_event) {
    if (err) {
      console.log("mongoose model errors " + err.errors);
      return next(err);
    }
    res.status(200).json(removed_event);
  });
}

module.exports = Controller.prototype;