(function () {
  'use strict';

  // Clubevents controller
  angular
    .module('clubevents')
    .controller('ClubeventsController', ClubeventsController);

  ClubeventsController.$inject = ['LocationsService','$scope', '$state', 'Authentication', 'clubeventResolve'];

  function ClubeventsController (LocationsService, $scope, $state, Authentication, clubevent) {
    var vm = this;
    
    vm.locations = LocationsService.query().$promise.then(function (result) {
      vm.locations = result;
      console.log(vm.locations);
  
      function containsRoute(route) 
      {
        console.log(route._id);
  
        var result = false;
        if(vm.clubevent.routes.indexOf(route._id) !== -1)
        {
          result = true;
        }
        return result;
      }
  
      vm.clubEventRoutes = vm.locations.filter(containsRoute);
      
      console.log(vm.clubEventRoutes);
    });
    vm.authentication = Authentication;
    vm.clubevent = clubevent;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;
    vm.toggleParticipation = toggleParticipation;
    vm.isCurrentUserSignedUp = vm.clubevent.isCurrentUserSignedUp;
    vm.clickview = clickview;
    
    var dummyDate = new Date();


    if (vm.clubevent._id) {
      vm.clubevent.starttime = new Date(clubevent.start);
      vm.clubevent.endtime = new Date(clubevent.end);
      vm.clubevent.date = new Date(clubevent.start);
    }

    function clickview(id){
      $state.go('locations.view', {
        locationId: id
      });
    }

    // Remove existing Clubevent
    function remove() {
      if (confirm('Are you sure you want to delete?')) {
        vm.clubevent.$remove($state.go('clubevents.list'));
      }
    }
    
    function toggleParticipation() {
      console.log('Calling toggleParticipation()');
      console.log(vm.locations.length);
      if (vm.authentication.user) {
        vm.clubevent.$toggleParticipation(successCallback,errorCallback);
      }
      
      function successCallback(res) {
        if (vm.isCurrentUserSignedUp === true) {
          vm.isCurrentUserSignedUp = false;
        }
        else {
          vm.isCurrentUserSignedUp = true;
        }
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
    
    // Save Clubevent
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.clubeventForm');
        return false;
      }

      // karma tests won't run without the if statement, yay bad style
      if (vm.clubevent.date && vm.clubevent.starttime) {
        vm.clubevent.start = new Date(vm.clubevent.date.getFullYear(),vm.clubevent.date.getMonth(),vm.clubevent.date.getDate(),vm.clubevent.starttime.getHours(),vm.clubevent.starttime.getMinutes(), 0, 0);
        vm.clubevent.end = new Date(vm.clubevent.date.getFullYear(),vm.clubevent.date.getMonth(),vm.clubevent.date.getDate(),vm.clubevent.endtime.getHours(),vm.clubevent.endtime.getMinutes(), 0, 0);
      }
      
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
