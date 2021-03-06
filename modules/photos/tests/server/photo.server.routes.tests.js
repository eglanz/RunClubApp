'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Photo = mongoose.model('Photo'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app, agent, credentials, user, photo;

/**
 * Photo routes tests
 */
describe('Photo CRUD tests', function () {

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

    // Save a user to the test db and create new photo
    user.save(function () {
      photo = {
        title: 'Photo Title',
        content: 'Photo Content'
      };

      done();
    });
  });

  it('should be able to save an photo if logged in', function (done) {
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

        // Save a new photo
        agent.post('/api/photos')
          .send(photo)
          .expect(200)
          .end(function (photoSaveErr, photoSaveRes) {
            // Handle photo save error
            if (photoSaveErr) {
              return done(photoSaveErr);
            }

            // Get a list of photos
            agent.get('/api/photos')
              .end(function (photosGetErr, photosGetRes) {
                // Handle photo save error
                if (photosGetErr) {
                  return done(photosGetErr);
                }

                // Get photos list
                var photos = photosGetRes.body;

                // Set assertions
                (photos[0].user._id).should.equal(userId);
                (photos[0].title).should.match('Photo Title');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an photo if not logged in', function (done) {
    agent.post('/api/photos')
      .send(photo)
      .expect(403)
      .end(function (photoSaveErr, photoSaveRes) {
        // Call the assertion callback
        done(photoSaveErr);
      });
  });

  it('should not be able to save an photo if no title is provided', function (done) {
    // Invalidate title field
    photo.title = '';

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

        // Save a new photo
        agent.post('/api/photos')
          .send(photo)
          .expect(400)
          .end(function (photoSaveErr, photoSaveRes) {
            // Set message assertion
            (photoSaveRes.body.message).should.match('Title cannot be blank');

            // Handle photo save error
            done(photoSaveErr);
          });
      });
  });

  it('should be able to update an photo if signed in', function (done) {
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

        // Save a new photo
        agent.post('/api/photos')
          .send(photo)
          .expect(200)
          .end(function (photoSaveErr, photoSaveRes) {
            // Handle photo save error
            if (photoSaveErr) {
              return done(photoSaveErr);
            }

            // Update photo title
            photo.title = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing photo
            agent.put('/api/photos/' + photoSaveRes.body._id)
              .send(photo)
              .expect(200)
              .end(function (photoUpdateErr, photoUpdateRes) {
                // Handle photo update error
                if (photoUpdateErr) {
                  return done(photoUpdateErr);
                }

                // Set assertions
                (photoUpdateRes.body._id).should.equal(photoSaveRes.body._id);
                (photoUpdateRes.body.title).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of photos if not signed in', function (done) {
    // Create new photo model instance
    var photoObj = new Photo(photo);

    // Save the photo
    photoObj.save(function () {
      // Request photos
      request(app).get('/api/photos')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single photo if not signed in', function (done) {
    // Create new photo model instance
    var photoObj = new Photo(photo);

    // Save the photo
    photoObj.save(function () {
      request(app).get('/api/photos/' + photoObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('title', photo.title);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single photo with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/photos/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Photo is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single photo which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent photo
    request(app).get('/api/photos/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No photo with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an photo if signed in', function (done) {
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

        // Save a new photo
        agent.post('/api/photos')
          .send(photo)
          .expect(200)
          .end(function (photoSaveErr, photoSaveRes) {
            // Handle photo save error
            if (photoSaveErr) {
              return done(photoSaveErr);
            }

            // Delete an existing photo
            agent.delete('/api/photos/' + photoSaveRes.body._id)
              .send(photo)
              .expect(200)
              .end(function (photoDeleteErr, photoDeleteRes) {
                // Handle photo error error
                if (photoDeleteErr) {
                  return done(photoDeleteErr);
                }

                // Set assertions
                (photoDeleteRes.body._id).should.equal(photoSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an photo if not signed in', function (done) {
    // Set photo user
    photo.user = user;

    // Create new photo model instance
    var photoObj = new Photo(photo);

    // Save the photo
    photoObj.save(function () {
      // Try deleting photo
      request(app).delete('/api/photos/' + photoObj._id)
        .expect(403)
        .end(function (photoDeleteErr, photoDeleteRes) {
          // Set message assertion
          (photoDeleteRes.body.message).should.match('User is not authorized');

          // Handle photo error error
          done(photoDeleteErr);
        });

    });
  });

  it('should be able to get a single photo that has an orphaned user reference', function (done) {
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

          // Save a new photo
          agent.post('/api/photos')
            .send(photo)
            .expect(200)
            .end(function (photoSaveErr, photoSaveRes) {
              // Handle photo save error
              if (photoSaveErr) {
                return done(photoSaveErr);
              }

              // Set assertions on new photo
              (photoSaveRes.body.title).should.equal(photo.title);
              should.exist(photoSaveRes.body.user);
              should.equal(photoSaveRes.body.user._id, orphanId);

              // force the photo to have an orphaned user reference
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

                    // Get the photo
                    agent.get('/api/photos/' + photoSaveRes.body._id)
                      .expect(200)
                      .end(function (photoInfoErr, photoInfoRes) {
                        // Handle photo error
                        if (photoInfoErr) {
                          return done(photoInfoErr);
                        }

                        // Set assertions
                        (photoInfoRes.body._id).should.equal(photoSaveRes.body._id);
                        (photoInfoRes.body.title).should.equal(photo.title);
                        should.equal(photoInfoRes.body.user, undefined);

                        // Call the assertion callback
                        done();
                      });
                  });
              });
            });
        });
    });
  });

  /*it('should be able to get a single photo if signed in and verify the custom "isCurrentUserOwner" field is set to "true"', function (done) {
    // Create new photo model instance
    photo.user = user;
    var photoObj = new Photo(photo);

    // Save the photo
    photoObj.save(function () {
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

          // Save a new photo
          agent.post('/api/photos')
            .send(photo)
            .expect(200)
            .end(function (photoSaveErr, photoSaveRes) {
              // Handle photo save error
              if (photoSaveErr) {
                return done(photoSaveErr);
              }

              // Get the photo
              agent.get('/api/pohtos/' + photoSaveRes.body._id)
                .expect(200)
                .end(function (photoInfoErr, photoInfoRes) {
                  // Handle photo error
                  if (photoInfoErr) {
                    return done(photoInfoErr);
                  }

                  // Set assertions
                  (photoInfoRes.body._id).should.equal(photoSaveRes.body._id);
                  (photoInfoRes.body.title).should.equal(photo.title);

                  // Assert that the "isCurrentUserOwner" field is set to true since the current User created it
                  (photoInfoRes.body.isCurrentUserOwner).should.equal(true);

                  // Call the assertion callback
                  done();
                });
            });
        });
    });
*/

  it('should be able to get a single photo if not signed in and verify the custom "isCurrentUserOwner" field is set to "false"', function (done) {
    // Create new photo model instance
    var photoObj = new Photo(photo);

    // Save the photo
    photoObj.save(function () {
      request(app).get('/api/photos/' + photoObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('title', photo.title);
          // Assert the custom field "isCurrentUserOwner" is set to false for the un-authenticated User
          res.body.should.be.instanceof(Object).and.have.property('isCurrentUserOwner', false);
          // Call the assertion callback
          done();
        });
    });
  });

  it('should be able to get single photo, that a different user created, if logged in & verify the "isCurrentUserOwner" field is set to "false"', function (done) {
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

      // Sign in with the user that will create the Photo
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

          // Save a new photo
          agent.post('/api/photos')
            .send(photo)
            .expect(200)
            .end(function (photoSaveErr, photoSaveRes) {
              // Handle photo save error
              if (photoSaveErr) {
                return done(photoSaveErr);
              }

              // Set assertions on new photo
              (photoSaveRes.body.title).should.equal(photo.title);
              should.exist(photoSaveRes.body.user);
              should.equal(photoSaveRes.body.user._id, userId);

              // now signin with the temporary user
              agent.post('/api/auth/signin')
                .send(_creds)
                .expect(200)
                .end(function (err, res) {
                  // Handle signin error
                  if (err) {
                    return done(err);
                  }

                  // Get the photo
                  agent.get('/api/photos/' + photoSaveRes.body._id)
                    .expect(200)
                    .end(function (photoInfoErr, photoInfoRes) {
                      // Handle photo error
                      if (photoInfoErr) {
                        return done(photoInfoErr);
                      }

                      // Set assertions
                      (photoInfoRes.body._id).should.equal(photoSaveRes.body._id);
                      (photoInfoRes.body.title).should.equal(photo.title);
                      // Assert that the custom field "isCurrentUserOwner" is set to false since the current User didn't create it
                      (photoInfoRes.body.isCurrentUserOwner).should.equal(false);

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
      Photo.remove().exec(done);
    });
  });
});
