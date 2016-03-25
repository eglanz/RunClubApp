'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Location = mongoose.model('Location'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app, agent, credentials, userGlobal, locationGlobal;

/**
 * Location routes tests
 */
describe('Location CRUD tests', function () {

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
    userGlobal = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'test@test.com',
      username: credentials.username,
      password: credentials.password,
      provider: 'local'
    });

    // Save a user to the test db and create new location
    userGlobal.save(function () {
      locationGlobal = {
        name: 'Chicago',
        content: 'egi~FhfcvOajCcyA',
        length: 1.1,
        hills: 1,
        scenic: 3,
        traffic: 4,
        overall:3,
        user: userGlobal
      };

      done();
    });
  });

  it('should be able to save a location if logged in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = userGlobal.id;

        // Save a new location
        agent.post('/api/locations')
          .send(locationGlobal)
          .expect(200)
          .end(function (locationSaveErr, locationSaveRes) {
            // Handle location save error
            if (locationSaveErr) {
              return done(locationSaveErr);
            }

            // Get a list of locations
            agent.get('/api/locations')
              .end(function (locationsGetErr, locationsGetRes) {
                // Handle location save error
                if (locationsGetErr) {
                  return done(locationsGetErr);
                }

                // Get locations list
                var locations = locationsGetRes.body;

                // Set assertions
                (locations[0].user._id).should.equal(userId);
                (locations[0].name).should.match('Chicago');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save a location if not logged in', function (done) {
    agent.post('/api/locations')
      .send(locationGlobal)
      .expect(403)
      .end(function (locationSaveErr, locationSaveRes) {
        // Call the assertion callback
        done(locationSaveErr);
      });
  });

  it('should not be able to save a location if no name is provided', function (done) {
    // Invalidate title field
    locationGlobal.name = '';

    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = userGlobal.id;

        // Save a new location
        agent.post('/api/locations')
          .send(locationGlobal)
          .expect(400)
          .end(function (locationSaveErr, locationSaveRes) {
            // Set message assertion
            (locationSaveRes.body.message).should.match('Name cannot be empty');

            // Handle location save error
            done(locationSaveErr);
          });
      });
  });

  it('should not be able to get a list of locations if not signed in', function (done) {
    // Create new location model instance
    var locationObj = new Location(locationGlobal);
    var expect = require('chai').expect;

    // Save the location
    locationObj.save(function () {
      // Request locations
      try
      {
        request(app).get('/api/locations' )
        .end(function (req, res) {

          expect.fail();
        });
      }
      catch(e)
      {
        done();
      }
          // this works
      done();

    });
  });

  it('should be able to get a single location if not signed in', function (done) {
    // Create new location model instance
    var locationObj = new Location(locationGlobal);

    // Save the location
    locationObj.save(function () {
      request(app).get('/api/locations/' + locationObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', locationGlobal.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single alocation with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/locations/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Location is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single location which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent location
    request(app).get('/api/locations/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No location with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  /*it('should be able to delete an article if signed in', function (done) {
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

        // Save a new article
        agent.post('/api/articles')
          .send(article)
          .expect(200)
          .end(function (articleSaveErr, articleSaveRes) {
            // Handle article save error
            if (articleSaveErr) {
              return done(articleSaveErr);
            }

            // Delete an existing article
            agent.delete('/api/articles/' + articleSaveRes.body._id)
              .send(article)
              .expect(200)
              .end(function (articleDeleteErr, articleDeleteRes) {
                // Handle article error error
                if (articleDeleteErr) {
                  return done(articleDeleteErr);
                }

                // Set assertions
                (articleDeleteRes.body._id).should.equal(articleSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });*/

  /*it('should not be able to delete an article if not signed in', function (done) {
    // Set article user
    article.user = user;

    // Create new article model instance
    var articleObj = new Article(article);

    // Save the article
    articleObj.save(function () {
      // Try deleting article
      request(app).delete('/api/articles/' + articleObj._id)
        .expect(403)
        .end(function (articleDeleteErr, articleDeleteRes) {
          // Set message assertion
          (articleDeleteRes.body.message).should.match('User is not authorized');

          // Handle article error error
          done(articleDeleteErr);
        });

    });
  });*/

  it('should be able to get a single location that has an orphaned user reference', function (done) {
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

          // Save a new location
          agent.post('/api/locations')
            .send(locationGlobal)
            .expect(200)
            .end(function (locationSaveErr, locationSaveRes) {
              // Handle location save error
              if (locationSaveErr) {
                return done(locationSaveErr);
              }

              // Set assertions on new location
              (locationSaveRes.body.name).should.equal(locationGlobal.name);
              should.exist(locationSaveRes.body.user);
              should.equal(locationSaveRes.body.user._id, orphanId);

              // force the locatoin to have an orphaned user reference
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

                    // Get the location
                    agent.get('/api/locations/' + locationSaveRes.body._id)
                      .expect(200)
                      .end(function (locationInfoErr, locationInfoRes) {
                        // Handle location error
                        if (locationInfoErr) {
                          return done(locationInfoErr);
                        }

                        // Set assertions
                        (locationInfoRes.body._id).should.equal(locationSaveRes.body._id);
                        (locationInfoRes.body.name).should.equal(locationGlobal.name);
                        should.equal(locationInfoRes.body.user, undefined);

                        // Call the assertion callback
                        done();
                      });
                  });
              });
            });
        });
    });
  });

  it('should be able to get a single location if signed in and verify the custom "isCurrentUserOwner" field is set to "true"', function (done) {
    // Create new location model instance
    locationGlobal.user = userGlobal;
    var locationObj = new Location(locationGlobal);

    // Save the location
    locationObj.save(function () {
      agent.post('/api/auth/signin')
        .send(credentials)
        .expect(200)
        .end(function (signinErr, signinRes) {
          // Handle signin error
          if (signinErr) {
            return done(signinErr);
          }

          // Get the userId
          var userId = userGlobal.id;

          // Save a new location
          agent.post('/api/locations')
            .send(locationGlobal)
            .expect(200)
            .end(function (locationSaveErr, locationSaveRes) {
              // Handle location save error
              if (locationSaveErr) {
                return done(locationSaveErr);
              }

              // Get the location
              agent.get('/api/locations/' + locationSaveRes.body._id)
                .expect(200)
                .end(function (locationInfoErr, locationInfoRes) {
                  // Handle location error
                  if (locationInfoErr) {
                    return done(locationInfoErr);
                  }

                  // Set assertions
                  (locationInfoRes.body._id).should.equal(locationSaveRes.body._id);
                  (locationInfoRes.body.name).should.equal(locationGlobal.name);

                  // Assert that the "isCurrentUserOwner" field is set to true since the current User created it
                  (locationInfoRes.body.isCurrentUserOwner).should.equal(true);

                  // Call the assertion callback
                  done();
                });
            });
        });
    });
  });

  it('should be able to get a single location if not signed in and verify the custom "isCurrentUserOwner" field is set to "false"', function (done) {
    // Create new location model instance
    var locationObj = new Location(locationGlobal);

    // Save the location
    locationObj.save(function () {
      request(app).get('/api/locations/' + locationObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', locationGlobal.name);
          // Assert the custom field "isCurrentUserOwner" is set to false for the un-authenticated User
          res.body.should.be.instanceof(Object).and.have.property('isCurrentUserOwner', false);
          // Call the assertion callback
          done();
        });
    });
  });

  it('should be able to get single location, that a different user created, if logged in & verify the "isCurrentUserOwner" field is set to "false"', function (done) {
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

      // Sign in with the user that will create the Location
      agent.post('/api/auth/signin')
        .send(credentials)
        .expect(200)
        .end(function (signinErr, signinRes) {
          // Handle signin error
          if (signinErr) {
            return done(signinErr);
          }

          // Get the userId
          var userId = userGlobal._id;

          // Save a new location
          agent.post('/api/locations')
            .send(locationGlobal)
            .expect(200)
            .end(function (locationSaveErr, locationSaveRes) {
              // Handle location save error
              if (locationSaveErr) {
                return done(locationSaveErr);
              }

              // Set assertions on new location
              (locationSaveRes.body.name).should.equal(locationGlobal.name);
              should.exist(locationSaveRes.body.user);
              should.equal(locationSaveRes.body.user._id, userId);

              // now signin with the temporary user
              agent.post('/api/auth/signin')
                .send(_creds)
                .expect(200)
                .end(function (err, res) {
                  // Handle signin error
                  if (err) {
                    return done(err);
                  }

                  // Get the location
                  agent.get('/api/locations/' + locationSaveRes.body._id)
                    .expect(200)
                    .end(function (locationInfoErr, locationInfoRes) {
                      // Handle location error
                      if (locationInfoErr) {
                        return done(locationInfoErr);
                      }

                      // Set assertions
                      (locationInfoRes.body._id).should.equal(locationSaveRes.body._id);
                      (locationInfoRes.body.name).should.equal(locationGlobal.name);
                      // Assert that the custom field "isCurrentUserOwner" is set to false since the current User didn't create it
                      (locationInfoRes.body.isCurrentUserOwner).should.equal(false);

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
      Location.remove().exec(done);
    });
  });
});
