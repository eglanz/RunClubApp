'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Plan = mongoose.model('Plan');

/**
 * Globals
 */
var userGlobal, planGlobal;

/**
 * Unit tests
 */
describe('Plan Model Unit Tests:', function () {

  beforeEach(function (done) {
    userGlobal = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'test@test.com',
      username: 'username',
      password: 'M3@n.jsI$Aw3$0m3'
    });

    userGlobal.save(function () {
      planGlobal = new Plan({
        race: 'Marathon of Awesome',
        url: 'www.google.com',
      });

      done();
    });
  });

  describe('Method Save', function () {
    it('should be able to save without problems', function (done) {
      this.timeout(10000);
      return planGlobal.save(function (err) {
        console.log(err);
        should.not.exist(err);
        done();
      });
    });

    it('should be able to show an error when try to save without race name', function (done) {
      planGlobal.race = null;

      return planGlobal.save(function (err) {
        should.exist(err);
        done();
      });
    });
    it('should be able to show an error when try to save without url', function (done) {
      planGlobal.url = null;

      return planGlobal.save(function (err) {
        should.exist(err);
        done();
      });
    });

  });


  afterEach(function (done) {
    Plan.remove().exec(function () {
      User.remove().exec(done);
    });
  });
});
