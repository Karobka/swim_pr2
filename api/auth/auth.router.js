var express = require('express');
var router = express.Router();
var User = require('../user/user.model');
var controller = require('./auth.controller');
var passport = require('passport');
//var userRouter = require('.../config/routes.express');

router
    .post('/login', passport.authenticate('local', { successRedirect: '//', failureRedirect: '/login' }))
    .post('/create', controller.create)

module.exports = router;