var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('../server.js');
//chai should function
var should = chai.should();
//aliases for app and storage
var app = server.app;
//var storage = server.storage; how to test database??
//use chaiHTTP plugin
chai.use(chaiHttp);

describe('SwimPR', function(){
  it('should list swimmers on GET', function(done) {
    //make a request to the app and then use the following methods
    chai.request(app)
      //making a get request to this endpoint
      .get('/users')
      //after get request completes run this function to check what you received back
      .end(function(err, res) {
        //should.equal(err, null);
        res.should.have.status(200);
        //res.should.be.json;
        //res.body.should.be.a('array');
        //res.body[0].should.be.a('object');
        //done needs to be inside each test block or failure results.
        done();
      });
  });
  it('should add a swimmer on POST');
  it('should edit a swimmer on PUT');
  it('should delete a swimmer on DELETE');
});

var assert = require('assert');
describe('Array', function() {
  describe('#indexOf()', function() {
    it('should return -1 when the value is not present', function() {
      assert.equal(-1, [1,2,3].indexOf(4));
    });
  });
});