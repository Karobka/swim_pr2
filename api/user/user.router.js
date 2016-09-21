var express = require('express');
var router = express.Router();
var User = require('./user.model');
var controller = require('./user.controller');

function isLoggedIn (req, res, next) {
    if (req.user) {
        console.log('You are authenticated');
        return next();
    }
    res.json({
        message: 'Authentication failed'
    }).redirect('/');
}


router
    .get('/', isLoggedIn, controller.getSwimrs)
    .post('/', isLoggedIn, controller.createSwimr)
    .delete('/', isLoggedIn, controller.deleteSwimr)
    .post('/:name/history', isLoggedIn, controller.addSwimrEvent)
    .delete('/:name/history', isLoggedIn, controller.deleteSwimrEvent)

module.exports = router;