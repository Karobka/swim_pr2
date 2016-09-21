var mongoose = require('mongoose');

var eventSchema = mongoose.Schema({
    user_id: {
        type: String,
        required: true
    },
    swimr_name: {
        type: String,
        unique: true,
        required: true
    },
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
});

module.exports = mongoose.model('Event', eventSchema);