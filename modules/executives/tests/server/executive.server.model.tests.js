'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Executive = mongoose.model('Executive');

/**
 * Globals
 */
var user, executive;

/**
 * Unit tests
 */
describe('Executive Model Unit Tests:', function () {

  beforeEach(function (done) {
    user = new User({
      firstName: 'Glazed',
      lastName: 'Doughnut',
      displayName: 'Glazed Doughnut',
      email: 'test@test.com',
      roles: ['user', 'admin'],
      username: 'glazedDoughnut',
      password: 'M3@n.jsI$Aw3$0m3'
    });

    user.save(function () {
      executive = new Executive({
        firstName: 'Ham',
        lastName: 'Sandwich',
        email: 'ham.sandwich@email.com',
        descript: 'Better than the turkey sandwich?'
      });

      done();
    });
  });

  describe('Method Save', function () {
    it('should be able to save without problems', function (done) {
      this.timeout(10000);
      return executive.save(function (err) {
        should.not.exist(err);
        done();
      });
    });

    it('should be able to show an error when try to save without first name', function (done) {
      executive.firstName = '';

      return executive.save(function (err) {
        should.exist(err);
        done();
      });
    });
    
    it('should be able to show an error when try to save without last name', function (done) {
      executive.lastName = '';

      return executive.save(function (err) {
        should.exist(err);
        done();
      });
    });

  
    it('should be able to show an error when try to save without email', function (done) {
      executive.email = '';

      return executive.save(function (err) {
        should.exist(err);
        done();
      });
    });
    
  });
  

  afterEach(function (done) {
    Executive.remove().exec(function () {
      Executive.remove().exec(done);
    });
  });
});
