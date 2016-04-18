(function () {
  'use strict';

  angular
    .module('executives')
    .controller('ExecutivesController', ExecutivesController);

  ExecutivesController.$inject = ['$scope', '$state', 'executiveResolve', 'Authentication'];

  function ExecutivesController($scope, $state, executive, Authentication) {
    var vm = this;

    vm.executive = executive;
    vm.authentication = Authentication;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Article
    function remove() {
      if (confirm('Are you sure you want to delete?')) {
        vm.executive.$remove($state.go('executives.list'));
      }
    }

    // Save Article
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.executiveForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.executive._id) {
        vm.executive.$update(successCallback, errorCallback);
      } else {
        vm.executive.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('executives.view', {
          executiveId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
})();
