(function () {
  'use strict';

  angular
    .module('photos.services')
    .factory('PhotosService', PhotosService)
    .factory('GetNames', GetNames);

  PhotosService.$inject = ['$resource'];
  GetNames.$inject = ['$resource'];
  GetAWS.$inject = ['$resource'];
  
  function GetNames($resource){
    return $resource('/api/photos/', {
    });
  }
  
  function GetAWS($resource){
    return $resource('/api/photo/key',{
    });
  }

  function PhotosService($resource) {
    return $resource('api/photos/:photoId', {
      photoId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
})();
