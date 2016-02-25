(function (app) {
  'use strict';

  app.registerModule('locations');
  app.registerModule('locations.services');
  app.registerModule('locations.routes', ['ui.router', 'locations.services']);
})(ApplicationConfiguration);