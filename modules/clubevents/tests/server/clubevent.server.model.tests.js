'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Clubevent = mongoose.model('Clubevent');

/**
 * Globals
 */
var user, clubevent;

/**
 * Unit tests
 */
describe('Clubevent Model Unit Tests:', function() {
  beforeEach(function(done) {
    user = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'test@test.com',
      username: 'username',
      password: 'password'
    });

    user.save(function() { 
      clubevent = new Clubevent({
        title: 'Clubevent Name',
        user: user
      });

      done();
    });
  });

  describe('Method Save', function() {
    it('should be able to save without problems', function(done) {
      this.timeout(0);
      return clubevent.save(function(err) {
        should.not.exist(err);
        done();
      });
    });

    it('should be able to show an error when try to save without name', function(done) { 
      clubevent.title = '';

      return clubevent.save(function(err) {
        should.exist(err);
        done();
      });
    });
  });

  afterEach(function(done) { 
    Clubevent.remove().exec(function(){
      User.remove().exec(function(){
        done();  
      });
    });
  });
});
