(function (app) {
  'use strict';

  app.registerModule('executives');
  app.registerModule('executives.services');
  app.registerModule('executives.routes', ['ui.router', 'executives.services']);
})(ApplicationConfiguration);
