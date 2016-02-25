(function () {
  'use strict';

  angular
    .module('locations')
    .controller('LocationsController', LocationsController);

  LocationsController.$inject = ['$scope', '$state', 'locationResolve', 'Authentication'];

  function LocationsController($scope, $state, location, Authentication) {
    var vm = this;

    vm.location = location;
    vm.authentication = Authentication;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    $scope.$on('mapInitialized', function(event,map) {
      var marker = map.markers[0];

      $scope.$watch('article.lat + article.lon',function(newVal,oldVal){
        if(newVal === oldVal){return;}
      // checks if value has changed 
        map.setCenter({ lat:$scope.article.lat,lng:$scope.article.lon });
        marker.setPosition({ lat:$scope.article.lat,lng:$scope.article.lon });
      });
    });

    // Remove existing Location
    function remove() {
      if (confirm('Are you sure you want to delete?')) {
        vm.location.$remove($state.go('locations.list'));
      }
    }

    // Save Location
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.locationForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.location._id) {
        vm.location.$update(successCallback, errorCallback);
      } else {
        vm.location.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('locations.view', {
          locationId: res._id,
          lat: 0,
          lon: 0
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
})();
