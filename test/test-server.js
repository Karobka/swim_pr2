var chai = require('chai');
var chaiHttp = require('chai-http');
var should = chai.should();
var server = require('../server.js');
var app = server.app;
//var User = require('../models/user');
var config = require('../config/config.js');
var storage = config.DATABASE_URL; //how to test database??

//use chaiHTTP plugin
chai.use(chaiHttp);

describe('SwimPR', function () {
  /*before(function (done) {
      server.runServer(function() {
        //User.create({ name: 'Tester777'}); //doesnt work...
      });
        done();
  });*/

  it('should list swimmers on GET', function (done) {
    chai.request(app)
      .get('/users')
      .end(function (err, res) {
        res.body[0].should.have.property('name');
        res.body[0].name.should.be.a('string');
        res.body[0].should.have.property('swim_history');
        //res.body[0].should.have.deep.property(res[0].swim_history[0],'eventName');
        res.should.have.status(200);
        done();
      });
  });

  it('should add a swimmer on POST', function (done) {
    chai.request(app)
      .post('/users')
      .send({'name': 'TesterTom'})
      .end(function (err, res) {
        res.should.have.status(201);
        res.body.should.have.property('name');
        done();
      });
  });
  
  it('should delete a swimmer on DELETE', function (done) {
    chai.request(app)
      .delete('/users')
      .send({name: 'TesterTom'})
      .end(function (err, res) {
        res.should.have.status(200);
        done();
      });
  });

 /* after(function (done) {
    server.runServer(function() {
      User.remove({name: 'Tester777'});
      User.remove({name: 'TesterTom'});
    });
      done();
  });*/
});
