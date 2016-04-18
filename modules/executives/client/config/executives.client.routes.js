(function () {
  'use strict';

  angular
    .module('executives.routes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('executives', {
        abstract: true,
        url: '/executives',
        template: '<ui-view/>'
      })
      .state('executives.list', {
        url: '',
        templateUrl: 'modules/executives/client/views/list-executives.client.view.html',
        controller: 'ExecutivesListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Leaders List'
        }
      })
      .state('executives.create', {
        url: '/create',
        templateUrl: 'modules/executives/client/views/form-executive.client.view.html',
        controller: 'ExecutivesController',
        controllerAs: 'vm',
        resolve: {
          executiveResolve: newExecutive
        },
        data: {
          roles: ['admin'],
          pageTitle : 'Leader Create'
        }
      })
      .state('executives.edit', {
        url: '/:executiveId/edit',
        templateUrl: 'modules/executives/client/views/form-executive.client.view.html',
        controller: 'ExecutivesController',
        controllerAs: 'vm',
        resolve: {
          executiveResolve: getExecutive
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Executive {{ executiveResolve.firstName }}'
        }
      })
      .state('executives.view', {
        url: '/:executiveId',
        templateUrl: 'modules/executives/client/views/view-executive.client.view.html',
        controller: 'ExecutivesController',
        controllerAs: 'vm',
        resolve: {
          executiveResolve: getExecutive
        },
        data:{
          pageTitle: 'Executive {{ executiveResolve.firstName }}'
        }
      });
  }

  getExecutive.$inject = ['$stateParams', 'ExecutivesService'];

  function getExecutive($stateParams, ExecutivesService) {
    return ExecutivesService.get({
      executiveId: $stateParams.executiveId
    }).$promise;
  }

  newExecutive.$inject = ['ExecutivesService'];

  function newExecutive(ExecutivesService) {
    return new ExecutivesService();
  }
})();
