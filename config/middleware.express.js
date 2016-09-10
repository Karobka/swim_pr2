var express = require('express');
var bodyParser = require('body-parser');
//Why dont we need var app = express()??


module.exports = function(app) {
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({
        extended: false
    }));
    app.use(express.static('public'));
}