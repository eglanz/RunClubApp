(function () {
  'use strict';

  angular
    .module('locations.services')
    .factory('RecommendationsService', RecommendationsService)
    .factory('LocationsService', LocationsService);

  LocationsService.$inject = ['$resource'];
  RecommendationsService.$inject = ['$resource'];

  function LocationsService($resource) {
    return $resource('api/locations/:locationId', {
      articleId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
  
  function RecommendationsService($resource){
    return $resource('api/locations/jar/:miles', {
      miles: '@miles'
    });
  }
  
})();
