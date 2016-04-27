'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Photo = mongoose.model('Photo'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

/**
 * Create an photo
 */
exports.create = function (req, res) {
  var photo = new Photo(req.body);
  photo.user = req.user;

  photo.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(photo);
    }
  });
};

/**
 * Show the current photo
 */
exports.read = function (req, res) {
  // convert mongoose document to JSON
  var photo = req.photo ? req.photo.toJSON() : {};

  // Add a custom field to the Photo, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Photo model.
  photo.isCurrentUserOwner = req.user && photo.user && photo.user._id.toString() === req.user._id.toString() ? true : false;

  res.json(photo);
};

/**
 * Update an photo
 */
exports.update = function (req, res) {
  var photo = req.photo;

  photo.title = req.body.title;
  photo.content = req.body.content;

  photo.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(photo);
    }
  });
};

/**
 * Delete an photo
 */
exports.delete = function (req, res) {
  var photo = req.photo;

  photo.remove(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(photo);
    }
  });
};

/**
 * List of Photos
 */
exports.list = function (req, res) {
  Photo.find().sort('-created').populate('user', 'displayName').exec(function (err, photos) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(photos);
    }
  });
};

/**
 * Photo middleware
 */
exports.photoByID = function (req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Photo is invalid'
    });
  }

  Photo.findById(id).populate('user', 'displayName').exec(function (err, photo) {
    if (err) {
      return next(err);
    } else if (!photo) {
      return res.status(404).send({
        message: 'No photo with that identifier has been found'
      });
    }
    req.photo = photo;
    next();
  });
};
