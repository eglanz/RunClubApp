(function (app) {
  'use strict';

  app.registerModule('photos');
  app.registerModule('photos.services');
  app.registerModule('photos.routes', ['ui.router', 'photos.services']);
})(ApplicationConfiguration);
