'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Clubevent = mongoose.model('Clubevent'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app, agent, credentials, user, clubevent;

/**
 * Clubevent routes tests
 */
describe('Clubevent CRUD tests', function () {

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

    // Save a user to the test db and create new Clubevent
    user.save(function () {
      clubevent = {
        title: 'Clubevent name'
      };

      done();
    });
  });

  it('should be able to save a Clubevent if logged in', function (done) {
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

        // Save a new Clubevent
        agent.post('/api/clubevents')
          .send(clubevent)
          .expect(200)
          .end(function (clubeventSaveErr, clubeventSaveRes) {
            // Handle Clubevent save error
            if (clubeventSaveErr) {
              return done(clubeventSaveErr);
            }

            // Get a list of Clubevents
            agent.get('/api/clubevents')
              .end(function (clubeventsGetErr, clubeventsGetRes) {
                // Handle Clubevent save error
                if (clubeventsGetErr) {
                  return done(clubeventsGetErr);
                }

                // Get Clubevents list
                var clubevents = clubeventsGetRes.body;

                // Set assertions
                (clubevents[0].user._id).should.equal(userId);
                (clubevents[0].title).should.match('Clubevent name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Clubevent if not logged in', function (done) {
    agent.post('/api/clubevents')
      .send(clubevent)
      .expect(403)
      .end(function (clubeventSaveErr, clubeventSaveRes) {
        // Call the assertion callback
        done(clubeventSaveErr);
      });
  });

  it('should not be able to save an Clubevent if no name is provided', function (done) {
    // Invalidate name field
    clubevent.title = '';

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

        // Save a new Clubevent
        agent.post('/api/clubevents')
          .send(clubevent)
          .expect(400)
          .end(function (clubeventSaveErr, clubeventSaveRes) {
            // Set message assertion
            (clubeventSaveRes.body.message).should.match('Please fill event title');

            // Handle Clubevent save error
            done(clubeventSaveErr);
          });
      });
  });

  it('should be able to update an Clubevent if signed in', function (done) {
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

        // Save a new Clubevent
        agent.post('/api/clubevents')
          .send(clubevent)
          .expect(200)
          .end(function (clubeventSaveErr, clubeventSaveRes) {
            // Handle Clubevent save error
            if (clubeventSaveErr) {
              return done(clubeventSaveErr);
            }

            // Update Clubevent name
            clubevent.title = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Clubevent
            agent.put('/api/clubevents/' + clubeventSaveRes.body._id)
              .send(clubevent)
              .expect(200)
              .end(function (clubeventUpdateErr, clubeventUpdateRes) {
                // Handle Clubevent update error
                if (clubeventUpdateErr) {
                  return done(clubeventUpdateErr);
                }

                // Set assertions
                (clubeventUpdateRes.body._id).should.equal(clubeventSaveRes.body._id);
                (clubeventUpdateRes.body.title).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Clubevents if not signed in', function (done) {
    // Create new Clubevent model instance
    var clubeventObj = new Clubevent(clubevent);

    // Save the clubevent
    clubeventObj.save(function () {
      // Request Clubevents
      request(app).get('/api/clubevents')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Clubevent if not signed in', function (done) {
    // Create new Clubevent model instance
    var clubeventObj = new Clubevent(clubevent);

    // Save the Clubevent
    clubeventObj.save(function () {
      request(app).get('/api/clubevents/' + clubeventObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('title', clubevent.title);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Clubevent with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/clubevents/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Clubevent is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Clubevent which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Clubevent
    request(app).get('/api/clubevents/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Clubevent with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Clubevent if signed in', function (done) {
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

        // Save a new Clubevent
        agent.post('/api/clubevents')
          .send(clubevent)
          .expect(200)
          .end(function (clubeventSaveErr, clubeventSaveRes) {
            // Handle Clubevent save error
            if (clubeventSaveErr) {
              return done(clubeventSaveErr);
            }

            // Delete an existing Clubevent
            agent.delete('/api/clubevents/' + clubeventSaveRes.body._id)
              .send(clubevent)
              .expect(200)
              .end(function (clubeventDeleteErr, clubeventDeleteRes) {
                // Handle clubevent error error
                if (clubeventDeleteErr) {
                  return done(clubeventDeleteErr);
                }

                // Set assertions
                (clubeventDeleteRes.body._id).should.equal(clubeventSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Clubevent if not signed in', function (done) {
    // Set Clubevent user
    clubevent.user = user;

    // Create new Clubevent model instance
    var clubeventObj = new Clubevent(clubevent);

    // Save the Clubevent
    clubeventObj.save(function () {
      // Try deleting Clubevent
      request(app).delete('/api/clubevents/' + clubeventObj._id)
        .expect(403)
        .end(function (clubeventDeleteErr, clubeventDeleteRes) {
          // Set message assertion
          (clubeventDeleteRes.body.message).should.match('User is not authorized');

          // Handle Clubevent error error
          done(clubeventDeleteErr);
        });

    });
  });

  it('should be able to get a single Clubevent that has an orphaned user reference', function (done) {
    // Create orphan user creds
    var _creds = {
      username: 'orphan',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create orphan user
    var _orphan = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'orphan@test.com',
      username: _creds.username,
      password: _creds.password,
      provider: 'local'
    });

    _orphan.save(function (err, orphan) {
      // Handle save error
      if (err) {
        return done(err);
      }

      agent.post('/api/auth/signin')
        .send(_creds)
        .expect(200)
        .end(function (signinErr, signinRes) {
          // Handle signin error
          if (signinErr) {
            return done(signinErr);
          }

          // Get the userId
          var orphanId = orphan._id;

          // Save a new Clubevent
          agent.post('/api/clubevents')
            .send(clubevent)
            .expect(200)
            .end(function (clubeventSaveErr, clubeventSaveRes) {
              // Handle Clubevent save error
              if (clubeventSaveErr) {
                return done(clubeventSaveErr);
              }

              // Set assertions on new Clubevent
              (clubeventSaveRes.body.title).should.equal(clubevent.title);
              should.exist(clubeventSaveRes.body.user);
              should.equal(clubeventSaveRes.body.user._id, orphanId);

              // force the Clubevent to have an orphaned user reference
              orphan.remove(function () {
                // now signin with valid user
                agent.post('/api/auth/signin')
                  .send(credentials)
                  .expect(200)
                  .end(function (err, res) {
                    // Handle signin error
                    if (err) {
                      return done(err);
                    }

                    // Get the Clubevent
                    agent.get('/api/clubevents/' + clubeventSaveRes.body._id)
                      .expect(200)
                      .end(function (clubeventInfoErr, clubeventInfoRes) {
                        // Handle Clubevent error
                        if (clubeventInfoErr) {
                          return done(clubeventInfoErr);
                        }

                        // Set assertions
                        (clubeventInfoRes.body._id).should.equal(clubeventSaveRes.body._id);
                        (clubeventInfoRes.body.title).should.equal(clubevent.title);
                        should.equal(clubeventInfoRes.body.user, undefined);

                        // Call the assertion callback
                        done();
                      });
                  });
              });
            });
        });
    });
  });

  afterEach(function (done) {
    User.remove().exec(function () {
      Clubevent.remove().exec(done);
    });
  });
});
