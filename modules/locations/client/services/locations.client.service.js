(function () {
  'use strict';

  angular
    .module('locations.services')
    .factory('LocationsService', LocationsService);

  LocationsService.$inject = ['$resource'];

  function LocationsService($resource) {
    return $resource('api/locations/:locationId', {
      articleId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
})();
