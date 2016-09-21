var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var swimrSchema = new Schema({
    user_id: {
        type: String,
        required: true
    },
    swimr_name: {
        type: String,
        unique: true,
        required: true
    },
    swimr_id: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('Swimr', swimrSchema);