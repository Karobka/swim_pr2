var mongoose = require('mongoose');


var eventSchema = mongoose.Schema({
    eventName: {
        type: String,
        required: true,
        unique: true
    },
    eventDate: {
        
    },
    eventStroke: {

    },
    eventDistance: {

    },
    eventTime: {

    },
    eventRank: {

    }
});

//module.exports = mongoose.model('User', userSchema);
var Event = mongoose.model('Event', eventSchema);
module.exports = Event;