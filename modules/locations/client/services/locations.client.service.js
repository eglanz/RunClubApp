(function () {
  'use strict';

  angular
    .module('locations.services')
    .factory('RecommendationsService', RecommendationsService)
    .factory('LikeService', LikeService)
    .factory('UnLikeService', UnLikeService)
    .factory('LocationsService', LocationsService);

  LocationsService.$inject = ['$resource'];
  RecommendationsService.$inject = ['$resource'];
  LikeService.$inject = ['$resource'];

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
  
  function LikeService($resource){
    return $resource('api/locations/like/:locationId', {
      locationId: '@locationId'
    });
  }
  
  function UnLikeService($resource){
    return $resource('api/locations/unlike/:locationId', {
      locationId: '@locationId'
    });
  }
  
})();
