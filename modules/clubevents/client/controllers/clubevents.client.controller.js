(function () {
  'use strict';

  // Clubevents controller
  angular
    .module('clubevents')
    .controller('ClubeventsController', ClubeventsController);

  ClubeventsController.$inject = ['$scope', '$state', 'Authentication', 'clubeventResolve'];

  function ClubeventsController ($scope, $state, Authentication, clubevent) {
    var vm = this;
    
    vm.authentication = Authentication;
    vm.clubevent = clubevent;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;
    
    vm.clubevent.starttime = clubevent.start;
    vm.clubevent.endtime = clubevent.end;
    vm.clubevent.date = clubevent.start;

    // Remove existing Clubevent
    function remove() {
      if (confirm('Are you sure you want to delete?')) {
        vm.clubevent.$remove($state.go('clubevents.list'));
      }
    }

    // Save Clubevent
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.clubeventForm');
        return false;
      }

      vm.clubevent.start = new Date(vm.clubevent.date.getFullYear(),vm.clubevent.date.getMonth(),vm.clubevent.date.getDate(),vm.clubevent.starttime.getHours(),vm.clubevent.starttime.getMinutes(), 0, 0);
      vm.clubevent.end = new Date(vm.clubevent.date.getFullYear(),vm.clubevent.date.getMonth(),vm.clubevent.date.getDate(),vm.clubevent.endtime.getHours(),vm.clubevent.endtime.getMinutes(), 0, 0);
      
      if (vm.clubevent._id) {
        vm.clubevent.$update(successCallback, errorCallback);
      } else {
        vm.clubevent.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        // add url to newly created events
        if (!vm.clubevent.url) {
          vm.clubevent.url = 'clubevents/' + res._id;
          vm.clubevent.$update(successCallback, errorCallback);
        }
        
        $state.go('clubevents.view', {
          clubeventId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
})();
