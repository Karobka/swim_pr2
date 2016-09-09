var express = require('express');
var config = require('./config/config');
var app = express();
var env = app.get('env');


require('./config/mongoose.connection.js')(config.MONGODB.URI(env));

require('./config/middleware.express')(app);

require('./config/routes.express')(app);

app.listen(config.EXPRESS.PORT(env), function() {
    console.log('Listening on localhost:' + config.EXPRESS.PORT(env));
});


exports.app = app;