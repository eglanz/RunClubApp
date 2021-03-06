(function () {
  'use strict';

  angular
    .module('locations.routes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('locations', {
        abstract: true,
        url: '/locations',
        template: '<ui-view/>'
      })
      .state('locations.list', {
        url: '',
        templateUrl: 'modules/locations/client/views/list-locations.client.view.html',
        controller: 'LocationsListController',
        controllerAs: 'vm',
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Locations List'
        }
      })
      .state('locations.create', {
        url: '/create',
        templateUrl: 'modules/locations/client/views/create-location.client.view.html',
        controller: 'LocationsController',
        controllerAs: 'vm',
        resolve: {
          locationResolve: newLocation
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle : 'locations Create'
        }
      })
      .state('locations.training_create', {
        url: '/training/create',
        templateUrl: 'modules/locations/client/views/form-training.client.view.html',
        controller: 'TrainingController',
        controllerAs: 'vm',
        resolve: {
          planResolve: newPlan
        },
        data: {
          roles: ['admin'],
          pageTitle : 'Plan Create'
        }
      })
      .state('locations.edit', {
        url: '/:locationId/edit',
        templateUrl: 'modules/locations/client/views/form-location.client.view.html',
        controller: 'LocationsController',
        controllerAs: 'vm',
        resolve: {
          locationResolve: getLocation
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit location {{ locationResolve.title }}'
        }
      })
      .state('locations.training_edit', {
        url: '/training/:planId/edit',
        templateUrl: 'modules/locations/client/views/form-training.client.view.html',
        controller: 'TrainingController',
        controllerAs: 'vm',
        resolve: {
          planResolve: getPlan
        },
        data: {
          roles: ['admin'],
          pageTitle: 'Edit plan {{ planResolve.race }}'
        }
      })
      .state('locations.recops', {
        url: '/rec',
        templateUrl: 'modules/locations/client/views/options-recommendations.client.view.html',
        controller: 'RecommendationsOptionsController',
        controllerAs: 'vm',
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Recommendation Options'
        }
      })
      .state('locations.reclist', {
        url: '/rec/:miles',
        templateUrl: 'modules/locations/client/views/list-recommendations.client.view.html',
        controller: 'RecommendationsListController',
        controllerAs: 'vm',
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Recommendation List'
        }
      })
      .state('locations.training', {
        url: '/training',
        templateUrl: 'modules/locations/client/views/training.client.view.html',
        controller: 'TrainingListController',
        controllerAs: 'vm',
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Training Plans'
        }
      })
      .state('locations.view', {
        url: '/:locationId',
        templateUrl: 'modules/locations/client/views/view-location.client.view.html',
        //controller: 'LocationsController',
        controller: 'LocationsViewController',
        controllerAs: 'vm',
        resolve: {
          locationResolve: getLocation
        },
        data:{
          pageTitle: 'location {{ locationResolve.name }}'
        }
      });
  }

  getLocation.$inject = ['$stateParams', 'LocationsService'];

  function getLocation($stateParams, LocationsService) {
    return LocationsService.get({
      locationId: $stateParams.locationId
    }).$promise;
  }
  
  getPlan.$inject = ['$stateParams', 'TrainingService'];

  function getPlan($stateParams, TrainingService) {
    return TrainingService.get({
      planId: $stateParams.planId
    }).$promise;
  }

  newLocation.$inject = ['LocationsService'];

  function newLocation(LocationsService) {
    return new LocationsService();
  }
  
  newPlan.$inject = ['TrainingService'];

  function newPlan(TrainingService) {
    return new TrainingService();
  }
})();

