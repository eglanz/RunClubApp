(function () {
  'use strict';

  angular
    .module('photos')
    .controller('PhotosController', PhotosController);

  PhotosController.$inject = ['$scope', '$state', 'photoResolve', 'Authentication'];

  function PhotosController($scope, $state, photo, Authentication) {
    var vm = this;

    vm.photo = photo;
    vm.authentication = Authentication;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Photo
    function remove() {
      if (confirm('Are you sure you want to delete?')) {
        vm.article.$remove($state.go('photos.list'));
      }
    }

    // Save Photo
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.photoForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.photo._id) {
        vm.photo.$update(successCallback, errorCallback);
      } else {
        vm.photo.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('photos.view', {
          photoId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
})();
