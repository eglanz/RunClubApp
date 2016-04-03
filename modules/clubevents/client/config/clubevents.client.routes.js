(function () {
  'use strict';

  angular
    .module('clubevents')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('clubevents', {
        abstract: true,
        url: '/clubevents',
        template: '<ui-view/>'
      })
      .state('clubevents.list', {
        url: '',
        templateUrl: 'modules/clubevents/client/views/list-clubevents.client.view.html',
        controller: 'ClubeventsListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Clubevents List'
        }
      })
      .state('clubevents.create', {
        url: '/create',
        templateUrl: 'modules/clubevents/client/views/form-clubevent.client.view.html',
        controller: 'ClubeventsController',
        controllerAs: 'vm',
        resolve: {
          clubeventResolve: newClubevent
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle : 'Clubevents Create'
        }
      })
      .state('clubevents.edit', {
        url: '/:clubeventId/edit',
        templateUrl: 'modules/clubevents/client/views/form-clubevent.client.view.html',
        controller: 'ClubeventsController',
        controllerAs: 'vm',
        resolve: {
          clubeventResolve: getClubevent
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Clubevent {{ clubeventResolve.title }}'
        }
      })
      .state('clubevents.view', {
        url: '/:clubeventId',
        templateUrl: 'modules/clubevents/client/views/view-clubevent.client.view.html',
        controller: 'ClubeventsController',
        controllerAs: 'vm',
        resolve: {
          clubeventResolve: getClubevent
        },
        data:{
          pageTitle: 'Clubevent {{ articleResolve.title }}'
        }
      });
  }

  getClubevent.$inject = ['$stateParams', 'ClubeventsService'];

  function getClubevent($stateParams, ClubeventsService) {
    return ClubeventsService.get({
      clubeventId: $stateParams.clubeventId
    }).$promise;
  }

  newClubevent.$inject = ['ClubeventsService'];

  function newClubevent(ClubeventsService) {
    return new ClubeventsService();
  }
})();
