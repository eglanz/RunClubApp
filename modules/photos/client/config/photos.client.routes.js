(function () {
  'use strict';

  angular
    .module('photos.routes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('photos', {
        abstract: true,
        url: '/photos',
        template: '<ui-view></ui-view>',
      })
      .state('photos.list', {
        url: '',
        templateUrl: 'modules/photos/client/views/list-photos.client.view.html',
        controller: 'PhotosListController',
        controllerAs: 'vm',
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Photos List'
        }
      })
      .state('photos.create', {
        url: '/create',
        templateUrl: 'modules/photos/client/views/form-photo.client.view.html',
        controller: 'PhotosController',
        controllerAs: 'vm',
        resolve: {
          photoResolve: newPhoto, 
          nameResolve: getNames//, 
          //awsResolve: getAWS
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle : 'Add Photo'
        }
      })
      .state('photos.edit', {
        url: '/:photoId/edit',
        templateUrl: 'modules/photos/client/views/form-photo.client.view.html',
        controller: 'PhotosController',
        controllerAs: 'vm',
        resolve: {
          nameResolve: getNames,
          photoResolve: getPhoto//,
          //awsResolve: getAWS
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Photo Description {{ photoResolve.title }}'
        }
      })
      .state('photos.view', {
        url: '/:photoId',
        templateUrl: 'modules/photos/client/views/view-photo.client.view.html',
        controller: 'PhotosControllerView',
        controllerAs: 'vm',
        resolve: {
          photoResolve: getPhoto//,
          //awsResolve: getAWS
        },
        data:{
          roles: ['user', 'admin'],
          pageTitle: 'Photo {{ photoResolve.title }}'
        }
      });
  }
  getNames.$inject = ['$stateParams', 'GetNames'];
  
  function getNames($stateParams, GetNames) {
    return GetNames.query({
    }).$promise;
  }
  
 /* getAWS.$inject = ['$stateParams', 'GetAWS'];
  
  function getAWS($stateParams, GetAWS) {
    alert('here');
    console.log('val ' + GetAWS);
    return GetAWS;//.query({
    //}).$promise;
  }*/
  
  getPhoto.$inject = ['$stateParams', 'PhotosService'];

  function getPhoto($stateParams, PhotosService) {
    return PhotosService.get({
      photoId: $stateParams.photoId
    }).$promise;
  }

  newPhoto.$inject = ['PhotosService'];

  function newPhoto(PhotosService) {
    return new PhotosService();
  }
})();
