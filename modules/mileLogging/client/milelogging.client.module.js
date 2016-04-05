(function (app) {
  'use strict';

  app.registerModule('milelogging');
  app.registerModule('milelogging.services');
  app.registerModule('milelogging.routes', ['ui.router', 'milelogging.services']);
})(ApplicationConfiguration);
