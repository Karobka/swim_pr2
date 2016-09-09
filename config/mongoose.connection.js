var mongoose = require('mongoose');
module.exports = function(url) {
    mongoose.connect(url);
}