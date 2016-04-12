(function () {
  'use strict';

  angular
    .module('milelogging')
    .controller('MileloggingController', MileloggingController);

  MileloggingController.$inject = ['$scope', '$state', 'mileloggingResolve', 'Authentication'];

  function MileloggingController($scope, $state, milelogging, Authentication) {
    var vm = this;

    vm.milelogging = milelogging;
    vm.authentication = Authentication;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;
    
    if (vm.milelogging._id){ //&& vm.milelogging.date) {
      vm.milelogging.date = new Date(milelogging.date);
    }
    // Remove existing Milelogging
    function remove() {
      if (confirm('Are you sure you want to delete?')) {
        vm.milelogging.$remove($state.go('milelogging.list'));
      }
    }

    // Save Milelogging
    function save(isValid) {
      //vm.form.milelogginForm.date = vm.form.milelogginForm.date
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.mileloggingForm');
        return false;
      }
      
       if (vm.milelogging.date ) {
      vm.milelogging.date = new Date(vm.milelogging.date.getFullYear(),vm.milelogging.date.getMonth(),vm.milelogging.date.getDate(),vm.milelogging.date.getHours(),vm.milelogging.date.getMinutes(), vm.milelogging.date.getSeconds(), vm.milelogging.date.getMilliseconds());
      }

      // TODO: move create/update logic to service
      if (vm.milelogging._id) {
        vm.milelogging.$update(successCallback, errorCallback);
      } else {
        vm.milelogging.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        
        $state.go('milelogging.view', {
          mileloggingId: res._id
        });
        res.date = new Date(res.date);
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
})();
