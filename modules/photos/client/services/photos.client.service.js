(function () {
  'use strict';

  angular
    .module('photos.services')
    .factory('PhotosService', PhotosService);

  PhotosService.$inject = ['$resource'];

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
