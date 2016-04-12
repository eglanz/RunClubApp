'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Milelogging = mongoose.model('Milelogging'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app, agent, credentials, user, milelogging;

/**
 * Milelogging routes tests
 */
describe('Milelogging CRUD tests', function () {

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

    // Save a user to the test db and create new milelogging
    user.save(function () {
      milelogging = {
        title: '5 miles',
        length: '5'
      };

      done();
    });
  });

  it('should be able to save an milelogging if logged in', function (done) {
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

        // Save a new milelog
        agent.post('/api/milelogging')
          .send(milelogging)
          .expect(200)
          .end(function (mileloggingSaveErr, mileloggingSaveRes) {
            // Handle milelogging save error
            if (mileloggingSaveErr) {
              return done(mileloggingSaveErr);
            }

            // Get a list of milelogging
            agent.get('/api/milelogging')
              .end(function (mileloggingGetErr, mileloggingGetRes) {
                // Handle milelogging save error
                if (mileloggingGetErr) {
                  return done(mileloggingGetErr);
                }

                // Get milelogging list
                var milelogging = mileloggingGetRes.body;

                // Set assertions
                (milelogging[0].user._id).should.equal(userId);
                (milelogging[0].title).should.match('Milelogging Title');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an milelogging if not logged in', function (done) {
    agent.post('/api/milelogging')
      .send(milelogging)
      .expect(403)
      .end(function (mileloggingSaveErr, mileloggingSaveRes) {
        // Call the assertion callback
        done(mileloggingSaveErr);
      });
  });

  it('should not be able to save an milelog if no title is provided', function (done) {
    // Invalidate title field
    milelogging.title = '';

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

        // Save a new milelogging
        agent.post('/api/milelogging')
          .send(milelogging)
          .expect(400)
          .end(function (mileloggingSaveErr, mileloggingSaveRes) {
            // Set message assertion
            (mileloggingSaveRes.body.message).should.match('Title cannot be blank');

            // Handle milelogging save error
            done(mileloggingSaveErr);
          });
      });
  });

  it('should be able to update an milelogging if signed in', function (done) {
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

        // Save a new milelogging
        agent.post('/api/milelogging')
          .send(milelogging)
          .expect(200)
          .end(function (mileloggingSaveErr, mileloggingSaveRes) {
            // Handle milelogging save error
            if (mileloggingSaveErr) {
              return done(mileloggingSaveErr);
            }

            // Update milelogging title
            milelogging.title = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing milelogging
            agent.put('/api/milelogging/' + mileloggingSaveRes.body._id)
              .send(milelogging)
              .expect(200)
              .end(function (mileloggingUpdateErr, mileloggingUpdateRes) {
                // Handle milelogging update error
                if (mileloggingUpdateErr) {
                  return done(mileloggingUpdateErr);
                }

                // Set assertions
                (mileloggingUpdateRes.body._id).should.equal(mileloggingSaveRes.body._id);
                (mileloggingUpdateRes.body.title).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of milelogs if not signed in', function (done) {
    // Create new milelogging model instance
    var mileloggingObj = new Milelogging(milelogging);

    // Save the milelogging
    mileloggingObj.save(function () {
      // Request milelogging
      request(app).get('/api/milelogging')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single milelogging if not signed in', function (done) {
    // Create new milelogging model instance
    var mileloggingObj = new Milelogging(milelogging);

    // Save the milelogging
    mileloggingObj.save(function () {
      request(app).get('/api/milelogging/' + mileloggingObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('title', milelogging.title);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single milelogging with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/milelogging/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Milelogging is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single milelogging which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent milelogging
    request(app).get('/api/milelogging/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No milelogging with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an milelogging if signed in', function (done) {
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

        // Save a new milelogging
        agent.post('/api/milelogging')
          .send(milelogging)
          .expect(200)
          .end(function (mileloggingSaveErr, mileloggingSaveRes) {
            // Handle milelogging save error
            if (mileloggingSaveErr) {
              return done(mileloggingSaveErr);
            }

            // Delete an existing milelogging
            agent.delete('/api/milelogging/' + mileloggingSaveRes.body._id)
              .send(milelogging)
              .expect(200)
              .end(function (mileloggingDeleteErr, mileloggingDeleteRes) {
                // Handle milelogging error error
                if (mileloggingDeleteErr) {
                  return done(mileloggingDeleteErr);
                }

                // Set assertions
                (mileloggingDeleteRes.body._id).should.equal(mileloggingSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an milelogging if not signed in', function (done) {
    // Set milelogging user
    milelogging.user = user;

    // Create new milelogging model instance
    var mileloggingObj = new Milelogging(milelogging);

    // Save the milelogging
    mileloggingObj.save(function () {
      // Try deleting milelogging
      request(app).delete('/api/milelogging/' + mileloggingObj._id)
        .expect(403)
        .end(function (mileloggingDeleteErr, mileloggingDeleteRes) {
          // Set message assertion
          (mileloggingDeleteRes.body.message).should.match('User is not authorized');

          // Handle milelogging error error
          done(mileloggingDeleteErr);
        });

    });
  });

  it('should be able to get a single milelogging that has an orphaned user reference', function (done) {
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

          // Save a new milelog
          agent.post('/api/milelogging')
            .send(milelogging)
            .expect(200)
            .end(function (mileloggingSaveErr, mileloggingSaveRes) {
              // Handle milelogging save error
              if (mileloggingSaveErr) {
                return done(mileloggingSaveErr);
              }

              // Set assertions on new milelogging
              (mileloggingSaveRes.body.title).should.equal(milelogging.title);
              should.exist(mileloggingSaveRes.body.user);
              should.equal(mileloggingSaveRes.body.user._id, orphanId);

              // force the milelog to have an orphaned user reference
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

                    // Get the milelogging
                    agent.get('/api/milelogging/' + mileloggingSaveRes.body._id)
                      .expect(200)
                      .end(function (mileloggingInfoErr, mileloggingInfoRes) {
                        // Handle milelogging error
                        if (mileloggingInfoErr) {
                          return done(mileloggingInfoErr);
                        }

                        // Set assertions
                        (mileloggingInfoRes.body._id).should.equal(mileloggingSaveRes.body._id);
                        (mileloggingInfoRes.body.title).should.equal(milelogging.title);
                        should.equal(mileloggingInfoRes.body.user, undefined);

                        // Call the assertion callback
                        done();
                      });
                  });
              });
            });
        });
    });
  });

  it('should be able to get a single milelogging if signed in and verify the custom "isCurrentUserOwner" field is set to "true"', function (done) {
    // Create new milelogging model instance
    milelogging.user = user;
    var mileloggingObj = new Milelogging(milelogging);

    // Save the milelogging
    mileloggingObj.save(function () {
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

          // Save a new milelogging
          agent.post('/api/milelogging')
            .send(milelogging)
            .expect(200)
            .end(function (mileloggingSaveErr, mileloggingSaveRes) {
              // Handle milelogging save error
              if (mileloggingSaveErr) {
                return done(mileloggingSaveErr);
              }

              // Get the milelogging
              agent.get('/api/milelogging/' + mileloggingSaveRes.body._id)
                .expect(200)
                .end(function (mileloggingInfoErr, mileloggingInfoRes) {
                  // Handle milelogging error
                  if (mileloggingInfoErr) {
                    return done(mileloggingInfoErr);
                  }

                  // Set assertions
                  (mileloggingInfoRes.body._id).should.equal(mileloggingSaveRes.body._id);
                  (mileloggingInfoRes.body.title).should.equal(milelogging.title);

                  // Assert that the "isCurrentUserOwner" field is set to true since the current User created it
                  (mileloggingInfoRes.body.isCurrentUserOwner).should.equal(true);

                  // Call the assertion callback
                  done();
                });
            });
        });
    });
  });

  it('should be able to get a single milelogging if not signed in and verify the custom "isCurrentUserOwner" field is set to "false"', function (done) {
    // Create new milelogging model instance
    var mileloggingObj = new Milelogging(milelogging);

    // Save the milelogging
    mileloggingObj.save(function () {
      request(app).get('/api/milelogging/' + mileloggingObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('title', milelogging.title);
          // Assert the custom field "isCurrentUserOwner" is set to false for the un-authenticated User
          res.body.should.be.instanceof(Object).and.have.property('isCurrentUserOwner', false);
          // Call the assertion callback
          done();
        });
    });
  });

  it('should be able to get single milelog, that a different user created, if logged in & verify the "isCurrentUserOwner" field is set to "false"', function (done) {
    // Create temporary user creds
    var _creds = {
      username: 'temp',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create temporary user
    var _user = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'temp@test.com',
      username: _creds.username,
      password: _creds.password,
      provider: 'local'
    });

    _user.save(function (err, _user) {
      // Handle save error
      if (err) {
        return done(err);
      }

      // Sign in with the user that will create the Milelogging
      agent.post('/api/auth/signin')
        .send(credentials)
        .expect(200)
        .end(function (signinErr, signinRes) {
          // Handle signin error
          if (signinErr) {
            return done(signinErr);
          }

          // Get the userId
          var userId = user._id;

          // Save a new milelogging
          agent.post('/api/milelogging')
            .send(milelogging)
            .expect(200)
            .end(function (mileloggingSaveErr, mileloggingSaveRes) {
              // Handle milelogging save error
              if (mileloggingSaveErr) {
                return done(mileloggingSaveErr);
              }

              // Set assertions on new milelogging
              (mileloggingSaveRes.body.title).should.equal(milelogging.title);
              should.exist(mileloggingSaveRes.body.user);
              should.equal(mileloggingSaveRes.body.user._id, userId);

              // now signin with the temporary user
              agent.post('/api/auth/signin')
                .send(_creds)
                .expect(200)
                .end(function (err, res) {
                  // Handle signin error
                  if (err) {
                    return done(err);
                  }

                  // Get the milelogging
                  agent.get('/api/milelogging/' + mileloggingSaveRes.body._id)
                    .expect(200)
                    .end(function (mileloggingInfoErr, mileloggingInfoRes) {
                      // Handle milelogging error
                      if (mileloggingInfoErr) {
                        return done(mileloggingInfoErr);
                      }

                      // Set assertions
                      (mileloggingInfoRes.body._id).should.equal(mileloggingSaveRes.body._id);
                      (mileloggingInfoRes.body.title).should.equal(milelogging.title);
                      // Assert that the custom field "isCurrentUserOwner" is set to false since the current User didn't create it
                      (mileloggingInfoRes.body.isCurrentUserOwner).should.equal(false);

                      // Call the assertion callback
                      done();
                    });
                });
            });
        });
    });
  });

  afterEach(function (done) {
    User.remove().exec(function () {
      Milelogging.remove().exec(done);
    });
  });
});
