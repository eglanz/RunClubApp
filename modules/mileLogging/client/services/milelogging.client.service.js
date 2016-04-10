(function () {
  'use strict';

  angular
    .module('milelogging.services')
    .factory('MileloggingService', MileloggingService)
    .factory('GetUser', GetUser);

  MileloggingService.$inject = ['$resource'];
  GetUser.$inject = ['$resource'];
  
  
  
  function GetUser($resource){
    return $resource('/api/users/me', {
    });
  }
  
  
  

  function MileloggingService($resource) {
    return $resource('api/milelogging/:mileloggingId', {
      mileloggingId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
})();
