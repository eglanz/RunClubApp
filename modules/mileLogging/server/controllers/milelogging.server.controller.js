'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Milelogging = mongoose.model('Milelogging'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');
  

/**
 * Create an mile log
 */
exports.create = function (req, res) {
  var milelogging = new Milelogging(req.body);
  milelogging.user = req.user;
  console.log('date server ' + milelogging.date);
  console.log('created server ' + milelogging.created);
  milelogging.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(milelogging);
    }
  });
};

/**
 * Show the current mile log
 */
exports.read = function (req, res) {
  // convert mongoose document to JSON
  var milelogging = req.milelogging ? req.milelogging.toJSON() : {};

  // Add a custom field to the Mile Log, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Mile Log model.
  milelogging.isCurrentUserOwner = req.user && milelogging.user && milelogging.user._id.toString() === req.user._id.toString() ? true : false;

  res.json(milelogging);
};

/**
 * Update a mile log
 */
exports.update = function (req, res) {
  var milelogging = req.milelogging ;

  milelogging = _.extend(milelogging , req.body);
  milelogging.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(milelogging);
    }
  });
};

/**
 * Delete an mile log
 */
exports.delete = function (req, res) {
  var milelogging = req.milelogging;

  milelogging.remove(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(milelogging);
    }
  });
};

/**
 * List of mile log
 */
exports.list = function (req, res) {

  Milelogging.find({ 'user': req.user }).sort('-created').populate('user', 'displayName').exec(function (err, mileloggings) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(mileloggings);
    }
  });
};

/**
 * Mile log middleware
 */
exports.mileloggingByID = function (req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Mile log is invalid'
    });
  }

  Milelogging.findById(id).populate('user', 'displayName').exec(function (err, milelogging) {
    if (err) {
      return next(err);
    } else if (!milelogging) {
      return res.status(404).send({
        message: 'No log entry with that identifier has been found'
      });
    }
    req.milelogging = milelogging;
    next();
  });
};
