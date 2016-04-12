'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Milelogging = mongoose.model('Milelogging');

/**
 * Globals
 */
var user, milelogging;

/**
 * Unit tests
 */
describe('Milelogging Model Unit Tests:', function () {

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
      milelogging = new Milelogging({
        title: '5 miles',
        length: '5',
        user: user
      });

      done();
    });
  });

  describe('Method Save', function () {
    it('should be able to save without problems', function (done) {
      this.timeout(10000);
      return milelogging.save(function (err) {
        should.not.exist(err);
        done();
      });
    });

    it('should be able to show an error when try to save without length', function (done) {
      milelogging.length = '';

      return milelogging.save(function (err) {
        should.exist(err);
        done();
      });
    });
    
    it('should be able to show an error when try to save without date', function (done) {
      milelogging.date = '';

      return milelogging.save(function (err) {
        should.exist(err);
        done();
      });
    });
  });

  afterEach(function (done) {
    Milelogging.remove().exec(function () {
      User.remove().exec(done);
    });
  });
});
