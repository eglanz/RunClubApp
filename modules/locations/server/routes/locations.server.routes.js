'use strict';

/**
 * Module dependencies
 */
var locationsPolicy = require('../policies/locations.server.policy'),
  locations = require('../controllers/locations.server.controller');
  


module.exports = function (app) {
  // Locations collection routes
  app.route('/api/locations').all(locationsPolicy.isAllowed)
    .get(locations.list)
    .post(locations.create);
    
  app.route('/api/plans').all(locationsPolicy.isAllowed)
    .get(locations.list_plans)
    .post(locations.create_plan);
    
  app.route('/api/locations/jar/:miles').all(locationsPolicy.isAllowed).get(locations.jar);
  app.route('/api/locations/like/:locationId').all(locationsPolicy.isAllowed).get(locations.like);
  app.route('/api/locations/unlike/:locationId').all(locationsPolicy.isAllowed).get(locations.unlike);

  // Single location routes
  app.route('/api/locations/:locationId').all(locationsPolicy.isAllowed)
    .get(locations.read)
    .put(locations.update)
    .delete(locations.delete);
  
  app.route('/api/plans/:planId').all(locationsPolicy.isAllowed)
    .get(locations.read_plan)
    .put(locations.update_plan)
    .delete(locations.delete_plan);

  // Finish by binding the location middleware
  app.param('locationId', locations.locationByID);
  app.param('planId', locations.planByID);
};

