'use strict';

/**
 * Module dependencies
 */
var clubeventsPolicy = require('../policies/clubevents.server.policy'),
  clubevents = require('../controllers/clubevents.server.controller');

module.exports = function(app) {
  // Clubevents Routes
  app.route('/api/clubevents').all(clubeventsPolicy.isAllowed)
    .get(clubevents.list)
    .post(clubevents.create);

  app.route('/api/clubevents/:clubeventId').all(clubeventsPolicy.isAllowed)
    .get(clubevents.read)
    .put(clubevents.update)
    .post(clubevents.toggleParticipation)
    .delete(clubevents.delete);

  // Finish by binding the Clubevent middleware
  app.param('clubeventId', clubevents.clubeventByID);
};
