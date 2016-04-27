'use strict';

/**
 * Module dependencies
 */
var photosPolicy = require('../policies/photos.server.policy'),
  photos = require('../controllers/photos.server.controller');

module.exports = function (app) {
  // Photos collection routes
  app.route('/api/photos').all(photosPolicy.isAllowed)
    .get(photos.list)
    .post(photos.create);

  // Single article routes
  app.route('/api/photos/:photoId').all(photosPolicy.isAllowed)
    .get(photos.read)
    .put(photos.update)
    .delete(photos.delete);

  // Finish by binding the photo middleware
  app.param('photoId', photos.photoByID);
};
