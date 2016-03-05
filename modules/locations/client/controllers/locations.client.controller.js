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
    vm.location.content = '';
    vm.location.length = 0;
    
    // Remove existing Location
    function remove() {
      if (confirm('Are you sure you want to delete?')) {
        vm.location.$remove($state.go('location.list'));
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
          locationId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }    
    }
    
    var markerArray = [];
    var polyline = new google.maps.Polyline({
      path: [],
      strokeColor: '#0000FF',
      strokeWeight: 3
    });
    
    $scope.$on('mapInitialized', function(event,map) {

      map.setCenter(new google.maps.LatLng(41.659278, -91.535411));
      var button = document.getElementById('resetRoute');
      button.addEventListener('click', resetRoute);
      var labels = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
      var labelIndex = 0;
      var routeArray =[];
        
      var directionsDisplay;
      var directionsService = new google.maps.DirectionsService();
      directionsDisplay = new google.maps.DirectionsRenderer();
        
      directionsDisplay.setMap(map);
      directionsDisplay.setPanel(document.getElementById('directionsPanel'));
      var input = /** @type {!HTMLInputElement} */(
          document.getElementById('pac-input'));

      var types = document.getElementById('type-selector');
      map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);
      map.controls[google.maps.ControlPosition.TOP_LEFT].push(types);

      var autocomplete = new google.maps.places.Autocomplete(input);
      autocomplete.bindTo('bounds', map);

      var infowindow = new google.maps.InfoWindow();
      var marker = new google.maps.Marker({
        map: map,
        anchorPoint: new google.maps.Point(0, -29)
      });

      autocomplete.addListener('place_changed', function() {
        infowindow.close();
        marker.setVisible(false);
        var place = autocomplete.getPlace();
        if (!place.geometry) {
          window.alert('Autocomplete returned place contains no geometry');
          return;
        }

        // If the place has a geometry, then present it on a map.
        if (place.geometry.viewport) {
          map.fitBounds(place.geometry.viewport);
        } else {
          map.setCenter(place.geometry.location);
          map.setZoom(17);  // Why 17? Because it looks good.
        }

        var address = '';
        if (place.address_components) {
          address = [
            (place.address_components[0] && place.address_components[0].short_name || ''),
            (place.address_components[1] && place.address_components[1].short_name || ''),
            (place.address_components[2] && place.address_components[2].short_name || '')
          ].join(' ');
        }

        infowindow.setContent('<div><strong>' + place.name + '</strong><br>' + address);
        infowindow.open(map, marker);
      });

        
      // This event listener calls addMarker() when the map is clicked.
      google.maps.event.addListener(map, 'click', function(event) {
        addMarker(event.latLng, map);
      });
        
      // Adds a marker to the map.
      function addMarker(location, map) {
        // Add the marker at the clicked location, and add the next-available label
        // from the array of alphabetical characters.
        var marker = new google.maps.Marker({
          position: location,
          label: labels[labelIndex++ % labels.length],
          map: map
        });
        markerArray.push(marker);
        routeArray.push(location);
        if(routeArray.length === 2)
        {
          calcRoute();
        }
      }
       
      function resetRoute() {
        setMapOnAll(null);
      }
      function setMapOnAll(map) {
        for (var i = 0; i < markerArray.length; i++) {
          markerArray[i].setMap(map);
        }
        markerArray = [];
        routeArray = [];
        polyline.setMap(null);
        polyline.setPath([]);
        labelIndex=0;
        vm.location.length = 0;
        length.value = 0 + ' miles';
      }
      
      function calcRoute() {
        if(routeArray.length === 2)
        {
          var start = routeArray[0];
          var end = routeArray[routeArray.length-1];
          var request = {
            origin: start,
            destination: end,
            travelMode: google.maps.TravelMode.WALKING, 
            provideRouteAlternatives: false
          };
          routeArray.shift();
          directionsService.route(request, function(response, status) {
            if (status === google.maps.DirectionsStatus.OK) 
            {
              var bounds = new google.maps.LatLngBounds();
              var legs = response.routes[0].legs;
              for (var i = 0; i < legs.length; i++) {
                var steps = legs[i].steps;
                for (var j = 0; j < steps.length; j++) {
                  var nextSegment = steps[j].path;
                  for (var k = 0; k < nextSegment.length; k++) {
                    polyline.getPath().push(nextSegment[k]);
                    bounds.extend(nextSegment[k]);
                  }
                }
              }

              polyline.setMap(map);
              var encodeString = google.maps.geometry.encoding.encodePath(polyline.getPath());
              vm.location.content = encodeString;
              vm.location.length = (google.maps.geometry.spherical.computeLength(polyline.getPath()) * 0.00062137).toFixed(2);
            
              length.value = vm.location.length + ' miles';
            }
            else
            {
              //TODO handle this correctly, should this allow them to enter a different location?
              alert('Incorrect.');
            }
          });
        }
        else
        {
          alert('You must choose at least 2 points.');
        }
      }
      
      $scope.$on('$destroy', function() {
        for (var i = 0; i < markerArray.length; i++) {
          markerArray[i].setMap(null);
        }
        polyline.setMap(null);
      });   
    });
  }
})();
