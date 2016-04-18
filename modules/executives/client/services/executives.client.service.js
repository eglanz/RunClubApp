(function () {
  'use strict';

  angular
    .module('executives.services')
    .factory('ExecutivesService', ExecutivesService);

  ExecutivesService.$inject = ['$resource'];

  function ExecutivesService($resource) {
    return $resource('api/executives/:executiveId', {
      executiveId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
})();
