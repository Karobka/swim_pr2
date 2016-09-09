exports.DATABASE_URL = 'mongodb://localhost/swim_pr2'

/*var config = {};

config.mongoURI = {
  development: 'mongodb://heroku_724f643s:5g60oejh5vmrdchk62of122vnl@ds013966.mlab.com:13966/heroku_724f643s',
  test: 'mongodb://localhost/swim_pr2'
};

module.exports = config;*/

MONGODB_URI= 'mongodb://heroku_724f643s:5g60oejh5vmrdchk62of122vnl@ds013966.mlab.com:13966/heroku_724f643s'
//process.env.PORT lets the hosting service like heroku set the port otherwise it uses 8080 locally
exports.PORT = process.env.PORT || 8080;

module.exports = {
  EXPRESS: {
    PORT: function(env) {
      if (env === 'development'){
        return 5000;
      }else if (env === 'production') {
        return process.env.PORT || 8080;
      }else if (env === 'test') {
        return 4000;
      }
    }
  },
  MONGODB: {
    URI: function(env) {
      if (env === 'development') {
        return 'mongodb://localhost/swim_pr2'
      }else if (env === 'production') {
        return process.env.MONGODB_URI || 'mongodb://localhost/swim_pr2'
      }else if (env === 'test') {
        return 'mongodb://localhost/swim_pr2'
      }
    }
  }
}