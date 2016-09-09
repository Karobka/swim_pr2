var express = require('express');
var router = express.Router();
var User = require('./user.model');
var controller = require('./user.controller');

router
    .get('/', controller.getUsers)
    .post('/', controller.createUser)
    .delete('/', controller.deleteUser)
    .post('/:name/history', controller.addUserEvent)
    .delete('/:name/history', controller.deleteUserEvent);

module.exports = router;