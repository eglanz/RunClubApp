//Clubevents service used to communicate Clubevents REST endpoints
(function () {
  'use strict';

  angular
    .module('clubevents')
    .factory('ClubeventsService', ClubeventsService);

  ClubeventsService.$inject = ['$resource'];

  function ClubeventsService($resource) {
    return $resource('api/clubevents/:clubeventId', {
      clubeventId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
})();
