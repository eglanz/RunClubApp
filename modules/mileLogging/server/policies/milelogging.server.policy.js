'use strict';

/**
 * Module dependencies
 */
var acl = require('acl');

// Using the memory backend
acl = new acl(new acl.memoryBackend());

/**
 * Invoke Milelogging Permissions
 */
exports.invokeRolesPolicies = function () {
  acl.allow([{
    roles: ['admin'],
    allows: [{
      resources: '/api/milelogging',
      permissions: '*'
    }, {
      resources: '/api/milelogging/:mileloggingId',
      permissions: '*'
    }]
  }, {
    roles: ['user'],
    allows: [{
      resources: '/api/milelogging',
      permissions: ['get', 'post']
    }, {
      resources: '/api/milelogging/:mileloggingId',
      permissions: ['get']
    }]
  }, {
    roles: ['guest'],
    allows: [{
      resources: '/api/milelogging',
      permissions: ['get']
    }, {
      resources: '/api/milelogging/:mileloggingId',
      permissions: ['get']
    }]
  }]);
};

/**
 * Check If Mile logging Policy Allows
 */
exports.isAllowed = function (req, res, next) {
  var roles = (req.user) ? req.user.roles : ['guest'];

  // If a mile log is being processed and the current user created it then allow any manipulation
  if (req.milelogging && req.user && req.milelogging.user && req.milelogging.user.id === req.user.id) {
    return next();
  }

  // Check for user roles
  acl.areAnyRolesAllowed(roles, req.route.path, req.method.toLowerCase(), function (err, isAllowed) {
    if (err) {
      // An authorization error occurred
      return res.status(500).send('Unexpected authorization error');
    } else {
      if (isAllowed) {
        // Access granted! Invoke next middleware
        return next();
      } else {
        return res.status(403).json({
          message: 'User is not authorized'
        });
      }
    }
  });
};
