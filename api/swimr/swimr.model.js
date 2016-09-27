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
        required: [true, 'You must enter a name for your swimmer']
    }
});

module.exports = mongoose.model('Swimr', swimrSchema);