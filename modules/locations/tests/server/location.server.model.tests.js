'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Location = mongoose.model('Location');

/**
 * Globals
 */
var user, location;

/**
 * Unit tests
 */
describe('Location Model Unit Tests:', function () {

  beforeEach(function (done) {
    user = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'test@test.com',
      username: 'username',
      password: 'M3@n.jsI$Aw3$0m3'
    });

    user.save(function () {
      location = new Location({
        name: 'Chicago',
        content: 'egi~FhfcvOajCcyA',
        length: 1.1,
        hills: 1,
        scenic: 3,
        traffic: 4,
        overall:3,
        user: user
      });

      done();
    });
  });

  describe('Method Save', function () {
    it('should be able to save without problems', function (done) {
      this.timeout(10000);
      return location.save(function (err) {
        should.not.exist(err);
        done();
      });
    });

    it('should be able to show an error when try to save without name', function (done) {
      location.name = '';

      return location.save(function (err) {
        should.exist(err);
        done();
      });
    });
    it('should be able to show an error when try to save without content', function (done) {
      location.content = null;

      return location.save(function (err) {
        should.exist(err);
        done();
      });
    });
    
  });


  afterEach(function (done) {
    Location.remove().exec(function () {
      User.remove().exec(done);
    });
  });
});
