var mongoose = require('mongoose');

var eventSchema = mongoose.Schema({
    user_id: {
        type: String,
        required: [true, 'Swim event is missing the user id']
    },
    swimr_name: {
        type: String,
        required: [true, 'Swim event is missing the swimmers name']
    },
    eventName: {
        type: String,
        required: [true, 'You must enter a name for the event'],
        unique: [true, 'You have an event with the same name.  You must enter a unique name for the event']
    },
    eventDate: {
        type: String,
        min: [10, 'Date is too small'],
        max: [10, 'Date is too large']
    },
    eventStroke: {
        type: String,
        default: 'none',
        enum: ['none', 'IM', 'freestyle', 'backstroke', 'butterfly', 'breaststroke']
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