var express = require('express');
var router = express.Router();
var User = require('./user.model');
var controller = require('./user.controller');

router
    .get('/users', controller.getUsers)
    .post('/users', controller.createUser)
    .delete('/users', controller.deleteUser)
    .post('/:name/history', controller.addUserEvent)
    .delete('/:name/history', controller.deleteUserEvent);
    // .post('/:name/history'), controller.addUserEvent);
    // .delete('/:name/history', controller.deleteUserEvent);

module.exports = router;