var mongoose = require('mongoose');

var userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    swim_history: {
        type: Array
    },
});

var User = mongoose.model('User', userSchema);
module.exports = User;

//NEED SCHEMA FOR SWIM EVENT NAMES!!