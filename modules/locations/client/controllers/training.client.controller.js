(function () {
  'use strict';

  angular
    .module('locations')
    .controller('TrainingController', TrainingController);

  TrainingController.$inject = ['$scope', '$state', 'planResolve', 'Authentication', '$window'];

  function TrainingController($scope, $state, plan, Authentication, $window) {
    var vm = this;

    vm.plan = plan;
    vm.authentication = Authentication;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;
    
    

    // Remove existing Article
    function remove() {
      if (confirm('Are you sure you want to delete?')) {
        vm.plan.$remove($state.go('locations.training'));
      }
    }
    
    

    // Save Article
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.planForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.plan._id) {
        vm.plan.$update(successCallback, errorCallback);
      } else {
        vm.plan.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('locations.training');
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
})();
