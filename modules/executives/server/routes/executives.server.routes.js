'use strict';

/**
 * Module dependencies
 */
var executivesPolicy = require('../policies/executives.server.policy'),
  executives = require('../controllers/executives.server.controller');

module.exports = function (app) {
  // Articles collection routes
  app.route('/api/executives').all(executivesPolicy.isAllowed)
    .get(executives.list)
    .post(executives.create);

  // Single article routes
  app.route('/api/executives/:executiveId').all(executivesPolicy.isAllowed)
    .get(executives.read)
    .put(executives.update)
    .delete(executives.delete);

  // Finish by binding the article middleware
  app.param('executiveId', executives.executiveByID);
};
