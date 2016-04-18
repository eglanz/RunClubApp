'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Executive = mongoose.model('Executive'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

/**
 * Create an executive
 */
exports.create = function (req, res) {
  var executive = new Executive(req.body);
  

  executive.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(executive);
    }
  });
};

/**
 * Show the current executive
 */
exports.read = function (req, res) {
  // convert mongoose document to JSON
  var executive = req.executive ? req.executive.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  executive.isAdmin = req.user.roles.indexOf('admin') !== -1 ? true : false;

  res.json(executive);
};

/**
 * Update an article
 */
exports.update = function (req, res) {
  var executive = req.executive;

  executive.firstName = req.body.firstName;
  executive.lastName = req.body.lastName;
  executive.email = req.body.email;
  executive.descript = req.body.descript;

  executive.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(executive);
    }
  });
};

/**
 * Delete an executive
 */
exports.delete = function (req, res) {
  var executive = req.executive;

  executive.remove(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(executive);
    }
  });
};

/**
 * List of Executives
 */
exports.list = function (req, res) {
  Executive.find().sort('-created').exec(function (err, executives) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(executives);
    }
  });
};

/**
 * Article middleware
 */
exports.executiveByID = function (req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Executive is invalid'
    });
  }

  Executive.findById(id).exec(function (err, executive) {
    if (err) {
      return next(err);
    } else if (!executive) {
      return res.status(404).send({
        message: 'No leader with that identifier has been found'
      });
    }
    req.executive = executive;
    next();
  });
};
