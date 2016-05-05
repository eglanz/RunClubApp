(function () {
  'use strict';

  angular
    .module('photos')
    .controller('PhotosListController', PhotosListController);
  PhotosListController.$inject = ['PhotosService','$scope', 'Authentication', 'FileUploader', '$state', '$timeout', '$window', '$http'];
  function PhotosListController(PhotosService, $scope, Authentication, FileUploader, photo, $state, $timeout, $window, $http) {
    var vm = this;
    vm.authentication = Authentication;
    vm.photos = PhotosService.query();
    $scope.src = 'https://s3-us-west-2.amazonaws.com/photobucketsoftwareproject/';
  }
})();
