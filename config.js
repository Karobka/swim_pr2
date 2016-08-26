exports.DATABASE_URL = 'mongodb://localhost/swim_pr2'
exports.MONGODB_URI= 'mongodb://heroku_724f643s:5g60oejh5vmrdchk62of122vnl@ds013966.mlab.com:13966/heroku_724f643s'
//exports.DATABASE_URI = 'mongodb://<dbuser>:<dbpassword>@ds147905.mlab.com:47905/swim_pr2_database'          
//process.env.PORT lets the hosting service like heroku set the port otherwise it uses 8080 locally
exports.PORT = process.env.PORT || 8080;