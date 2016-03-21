'use strict';

/**
 * Module dependencies
 */
var mailerPolicy = require('../policies/mailer.server.policy'),
  mailer = require('../controllers/mailer.server.controller');

module.exports = function (app) {
  // Articles collection routes
  app.route('/api/massmailer').all(mailerPolicy.isAllowed)
    .post(mailer.massMailer);
};