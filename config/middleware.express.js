var express = require('express');
var bodyParser = require('body-parser');


module.exports = function(app) {
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({
        extended: false
    }));
    
    app.use(express.static('public'));
}