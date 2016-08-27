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

//module.exports = mongoose.model('User', userSchema);
var User = mongoose.model('User', userSchema);
module.exports = User;

//NEED SCHEMA FOR SWIM EVENT NAMES!!