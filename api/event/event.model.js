var mongoose = require('mongoose');

var eventSchema = mongoose.Schema({
    user_id: {
        type: String,
        required: true
    },
    swimr_name: {
        type: String,
        required: true
    },
    eventName: {
        type: String,
        required: true,
        unique: true
    },
    eventDate: {
        type: Date
    },
    eventStroke: {
        type: String,
        default: 'none'
    },
    eventDistance: {
        type: String
    },
    eventTime: {
        type: String
    },
    eventRank: {
        type: String
    }
});

module.exports = mongoose.model('Event', eventSchema);