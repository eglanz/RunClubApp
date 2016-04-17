'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Executive = mongoose.model('Executive'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app, agent, credentials, user, executive;

/**
 * EXEC routes tests
 */
describe('Executive CRUD tests', function () {

  before(function (done) {
    // Get application
    app = express.init(mongoose);
    agent = request.agent(app);

    done();
  });

  beforeEach(function (done) {
    // Create user credentials
    credentials = {
      username: 'glazedDoughnut',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create a new user
    user = new User({
      firstName: 'Glazed',
      lastName: 'Doughnut',
      displayName: 'Glazed Doughnut',
      email: 'test@test.com',
      username: credentials.username,
      password: credentials.password,
      roles: ['user', 'admin'],
      provider: 'local'
    });

    // Save a user to the test db and create new exec
    user.save(function () {
      executive = {
        firstName: 'Ham',
        lastName: 'Sandwich',
        email: 'ham.sandwich@email.com',
        descript: 'Better than the turkey sandwich?'
      };

      done();
    });
  });

  it('should be able to save an exec if logged in as admin', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new exec
        agent.post('/api/executives')
          .send(executive)
          .expect(200)
          .end(function (executiveSaveErr, executiveSaveRes) {
            // Handle exc save error
            if (executiveSaveErr) {
              return done(executiveSaveErr);
            }

            // Get a list of execs
            agent.get('/api/executives')
              .end(function (executivesGetErr, executivesGetRes) {
                // Handle executive save error
                if (executivesGetErr) {
                  return done(executivesGetErr);
                }

                // Get executives list
                var executives = executivesGetRes.body;

                // Set assertions
                (executives[0].firstName).should.match('Ham');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an executive if not logged in', function (done) {
    agent.post('/api/executives')
      .send(executive)
      .expect(403)
      .end(function (executiveSaveErr, executiveSaveRes) {
        // Call the assertion callback
        done(executiveSaveErr);
      });
  });

  it('should not be able to save an executive if no firstName is provided', function (done) {
    // Invalidate 
    executive.firstName = '';

    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new executive
        agent.post('/api/executives')
          .send(executive)
          .expect(400)
          .end(function (executiveSaveErr, executiveSaveRes) {
            // Set message assertion
            (executiveSaveRes.body.message).should.match('First Name required');

            // Handle executive save error
            done(executiveSaveErr);
          });
      });
  });

 

  it('should be able to get a list of executives if not signed in', function (done) {
    // Create new article model instance
    var executiveObj = new Executive(executive);

    // Save the article
    executiveObj.save(function () {
      // Request articles
      request(app).get('/api/executives')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  

  it('should return proper error for single executive with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/executives/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Executive is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single executive which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent article
    request(app).get('/api/executives/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No leader with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  



 
  afterEach(function (done) {
    User.remove().exec(function () {
      Executive.remove().exec(done);
    });
  });
});
