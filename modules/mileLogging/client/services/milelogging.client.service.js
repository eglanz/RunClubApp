(function () {
  'use strict';

  angular
    .module('milelogging.services')
    .factory('MileloggingService', MileloggingService);

  MileloggingService.$inject = ['$resource'];

  function MileloggingService($resource) {
    return $resource('api/milelogging/:mileloggingId', {
      articleId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
})();
