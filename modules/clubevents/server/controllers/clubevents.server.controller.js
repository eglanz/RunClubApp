'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Clubevent = mongoose.model('Clubevent'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Clubevent
 */
exports.create = function(req, res) {
  var clubevent = new Clubevent(req.body);
  clubevent.user = req.user;

  clubevent.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(clubevent);
    }
  });
};

/**
 * Show the current Clubevent
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var clubevent = req.clubevent ? req.clubevent.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  clubevent.isCurrentUserOwner = req.user && clubevent.user && clubevent.user._id.toString() === req.user._id.toString() ? true : false;

  res.jsonp(clubevent);
};

/**
 * Update a Clubevent
 */
exports.update = function(req, res) {
  var clubevent = req.clubevent ;

  clubevent = _.extend(clubevent , req.body);

  clubevent.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(clubevent);
    }
  });
};

/**
 * Delete an Clubevent
 */
exports.delete = function(req, res) {
  var clubevent = req.clubevent ;

  clubevent.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(clubevent);
    }
  });
};

/**
 * List of Clubevents
 */
exports.list = function(req, res) { 
  Clubevent.find().sort('-created').populate('user', 'displayName').exec(function(err, clubevents) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(clubevents);
    }
  });
};

/**
 * Clubevent middleware
 */
exports.clubeventByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Clubevent is invalid'
    });
  }

  Clubevent.findById(id).populate('user', 'displayName').exec(function (err, clubevent) {
    if (err) {
      return next(err);
    } else if (!clubevent) {
      return res.status(404).send({
        message: 'No Clubevent with that identifier has been found'
      });
    }
    req.clubevent = clubevent;
    next();
  });
};
