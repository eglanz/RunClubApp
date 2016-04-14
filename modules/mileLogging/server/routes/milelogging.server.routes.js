'use strict';

/**
 * Module dependencies
 */
var mileloggingPolicy = require('../policies/milelogging.server.policy'),
  milelogging = require('../controllers/milelogging.server.controller');

module.exports = function (app) {
  // Milelogging collection routes
  app.route('/api/milelogging').all(mileloggingPolicy.isAllowed)
    .get(milelogging.list)
    .post(milelogging.create);

  // Single milelogging routes
  app.route('/api/milelogging/:mileloggingId').all(mileloggingPolicy.isAllowed)
    .get(milelogging.read)
    .put(milelogging.update)
    .delete(milelogging.delete);

  // Finish by binding the milelogging middleware
  app.param('mileloggingId', milelogging.mileloggingByID);
};
