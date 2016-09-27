var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
    username: {
        type: String,
        unique: true,
        required: [true, 'You must enter a username']
    },
    password: {
        type: String,
        required: [true, 'You must enter a password']
    }
});

userSchema.methods.verifyPassword = function(password) {
    if(this.password === password) {
        return true;
    }
}

module.exports = mongoose.model('User', userSchema);