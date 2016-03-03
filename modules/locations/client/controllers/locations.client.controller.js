(function () {
  'use strict';

  angular
    .module('locations')
    .controller('LocationsController', LocationsController);

  LocationsController.$inject = ['$scope', '$state', 'locationResolve', 'Authentication'];
  //var autocomplete;

  function LocationsController($scope, $state, location, Authentication) {
    var vm = this;
    
    
    
    
    
    
    
    
    
    
    $scope.$on('mapInitialized', function(event,map) {
        
    var button = document.getElementById("finalizeRoute");
    button.addEventListener("click", finalizeRoute);
    var labels = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    var labelIndex = 0;
    var routeArray =[];
    var polyline = new google.maps.Polyline({
      path: [],
      strokeColor: '#0000FF',
      strokeWeight: 3
    });
        
    var directionsDisplay;
    var directionsService = new google.maps.DirectionsService();
    directionsDisplay = new google.maps.DirectionsRenderer();
        
        directionsDisplay.setMap(map);
        directionsDisplay.setPanel(document.getElementById("directionsPanel"));
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
            window.alert("Autocomplete's returned place contains no geometry");
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
        //routeArray.push(marker);
        routeArray.push(location);
        //alert(location);
        if(routeArray.length == 2)
        {
          calcRoute();
        }
       }
       
      function finalizeRoute() {
        //alert("Hello World");
        //calcRoute();
        
      }
      
      function calcRoute() {
        if(routeArray.length == 2)
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
            
            //alert('ok');
          }
          else
          {
            alert('Too many points selected.');
        
          }
        });
      }
      else
      {
        
        alert("You must choose at least 2 points.");
      }
  }
      

});
      //google.maps.event.addDomListener(window, 'load', initialize);  
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    /*var autocomplete;
    var txt; // Declare variables
    var marker;
    var globalMap;
    
    
    document.getElementById ('but').addEventListener ('click', addItem, false);

    vm.location = location;
    vm.authentication = Authentication;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;


    $scope.$on('mapInitialized', function(event,map) {
      marker = map.markers[0];
      globalMap = map;
          // This event listener will call addMarker() when the map is clicked.
      globalMap.addListener('click', function(event) {
        addMarker(event.latLng);
      });
      autocomplete = new google.maps.places.Autocomplete(
      /** @type {HTMLInputElement} (document.getElementById('textInput')),
      { types: ['geocode'] });
      // When the user selects an address from the dropdown,
      //populate the address fields in the form.
       google.maps.event.addListener(autocomplete, 'place_changed', function() {
      fillInAddress();
      });
    });
    
    function addItem() {  
      var txt = document.getElementById('textInput').value;
      marker[marker.length] = txt;
      var geocoder = new google.maps.Geocoder();
      geocodeAddress(geocoder, globalMap);
      document.getElementById('textInput').value = '';
    }
    
    function geocodeAddress(geocoder, resultsMap) {
      var address = document.getElementById('textInput').value;
      geocoder.geocode({ 'address': address }, function(results, status) {
        if (status === google.maps.GeocoderStatus.OK) {
          resultsMap.setCenter(results[0].geometry.location);
          var marker2 = new google.maps.Marker({
            map: resultsMap,
            position: results[0].geometry.location
          });
        } else {
          alert('Geocode was not successful for the following reason: ' + status);
        }
      });
    }
    



     // [START region_fillform]
    function fillInAddress() {
    // Get the place details from the autocomplete object.
      var place = autocomplete.getPlace();
    }
    


    // Adds a marker to the map and push to the array.
    function addMarker(location) {
    var mark = new google.maps.Marker({
     position: location,
     map: globalMap
     });
     marker.push(mark);
    }   








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
          lat: 42,
          lon: -91
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }*/
  }
  
})();
