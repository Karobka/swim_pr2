var express = require('express');
var router = express.Router();
var User = require('../user/user.model');
var controller = require('./auth.controller');

router
    .post('/login', controller.login)
    .post('/create', controller.create)

module.exports = router;