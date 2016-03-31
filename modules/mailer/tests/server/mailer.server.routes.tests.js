'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  express = require(path.resolve('./config/lib/express'));
  
/**
 * Globals
 */
 
var app, agent, credentials, user;

describe('Mailer routes tests', function() {
  
  before(function (done) {
    // Get application
    app = express.init(mongoose);
    agent = request.agent(app);

    done();
  });
  
  beforeEach(function (done) {
    // Create user credentials
    credentials = {
      username: 'username',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create a new user
    user = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'test@test.com',
      username: credentials.username,
      password: credentials.password,
      provider: 'local'
    });
    
    // Save a user to the test db and create new article
    user.save(function (err) {
      should.not.exist(err);
      done();
    });
  });
  
  it('should not be able to create mass email if not admin', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        agent.get('/api/massmailer')
          .expect(403)
          .end(function (usersGetErr, usersGetRes) {
            if (usersGetErr) {
              return done(usersGetErr);
            }

            return done();
          });
      });
  });
  
  it('should be able to send a mass email if admin', function (done) {
    user.roles = ['user', 'admin'];

    user.save(function (err) {
      should.not.exist(err);
      agent.post('/api/auth/signin')
        .send(credentials)
        .expect(200)
        .end(function (signinErr, signinRes) {
          // Handle signin error
          if (signinErr) {
            return done(signinErr);
          }
          agent.post('/api/massmailer')
            .send({ 'content': 'test', 'subject': 'test' })
            .expect(200)
            .end(function (usersGetErr, usersGetRes) {
              if (usersGetErr) {
                return done(usersGetErr);
              }

              return done();
            });
        });
    });
  });
  
  afterEach(function (done) {
    User.remove().exec(done);
  });
});
