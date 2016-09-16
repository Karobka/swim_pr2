var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    swimrs: [
        {swimrName: String,
            swim_history: [{
                eventName: {
                    type: String,
                    required: true,
                    unique: true
                    },
                eventDate: {
                    type: Date,
                    default: Date.now
                },
                eventStroke: {
                    type: String,
                    required: false,
                    default: 'none'
                },
                eventDistance: {
                    type: String,
                    required: false
                },
                eventTime: {
                    type: String,
                    required: true
                },
                eventRank: {
                    type: String,
                    required: false
                }
            }]
        }
    ]
});

module.exports = mongoose.model('User', userSchema);

