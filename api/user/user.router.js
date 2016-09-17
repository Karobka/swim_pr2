var express = require('express');
var router = express.Router();
var User = require('./user.model');
var controller = require('./user.controller');

router
    /*.get('/', controller.getUsers)
    .post('/', controller.createUser)*/
    .delete('/', controller.deleteSwimr)
    .post('/:name/history', controller.addSwimrEvent)
    .delete('/:name/history', controller.deleteSwimrEvent)

module.exports = router;