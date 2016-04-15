(function () {
  'use strict';

  angular
    .module('milelogging.routes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('milelogging', {
        abstract: true,
        url: '/milelogging',
        template: '<ui-view/>'
      })
      .state('milelogging.list', {
        url: '',
        templateUrl: 'modules/milelogging/client/views/list-milelogging.client.view.html',
        controller: 'MileloggingListController',
        controllerAs: 'vm',
        resolve: {
          userResolve: getUservalue
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Mile Log'
        }
      })
      .state('milelogging.create', {
        url: '/create',
        templateUrl: 'modules/milelogging/client/views/form-milelogging.client.view.html',
        controller: 'MileloggingController',
        controllerAs: 'vm',
        resolve: {
          mileloggingResolve: newMilelogging
        },
        data: {
          pageTitle : 'Add Miles'
        }
      })
      .state('milelogging.edit', {
        url: '/:mileloggingId/edit',
        templateUrl: 'modules/milelogging/client/views/form-milelogging.client.view.html',
        controller: 'MileloggingController',
        controllerAs: 'vm',
        resolve: {
          mileloggingResolve: getMilelogging
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Log Entry'
        }
      })
      .state('milelogging.view', {
        url: '/:mileloggingId',
        templateUrl: 'modules/milelogging/client/views/view-milelogging.client.view.html',
        controller: 'MileloggingController',
        controllerAs: 'vm',
        resolve: {
          mileloggingResolve: getMilelogging
        },
        data:{
          pageTitle: 'Mile Logging'
        }
      });
  }

  getMilelogging.$inject = ['$stateParams', 'MileloggingService'];

  function getMilelogging($stateParams, MileloggingService) {
    return MileloggingService.get({
      mileloggingId: $stateParams.mileloggingId
    }).$promise;
  }
  
  getUservalue.$inject = ['$stateParams', 'GetUser'];
  
  function getUservalue($stateParams, GetUser) {
    return GetUser.get({
    }).$promise;
  }


  newMilelogging.$inject = ['MileloggingService'];

  function newMilelogging(MileloggingService) {
    return new MileloggingService();
  }
})();
