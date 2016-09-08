var mongoose = require('mongoose');
var SuperUserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    }
});

var SuperUser = mongoose.model('SuperUser', SuperUserSchema);
module.exports= SuperUser;