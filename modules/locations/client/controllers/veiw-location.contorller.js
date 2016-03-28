(function (){
  'use strict';

  angular
    .module('locations')
    .controller('LocationsViewController', LocationsViewController);

  LocationsViewController.$inject = ['$scope', '$state', 'locationResolve', 'Authentication'];

  function LocationsViewController($scope, $state, location, Authentication) {
    
    var vm = this;
    vm.location = location;
    vm.lat = 41.659941;
    vm.lon = -91.533864;
    var polyline;
    var decodedLine;
    var markerArray = [];
    var routeBeginning;
    var startPointMarker = null;
    var startPointPolyline = null;

    $scope.$on('mapInitialized', function(event,map) {
      var content = vm.location.content;
      decodedLine = [];
      decodedLine = google.maps.geometry.encoding.decodePath(content.toString());

      var routeArray = [];
      var directionsService = new google.maps.DirectionsService();
      polyline = new google.maps.Polyline({
        path: [],
        strokeColor: '#0000FF',
        strokeWeight: 3
      });
       
      var bounds = new google.maps.LatLngBounds();
      for (var n = 0; n < decodedLine.length ; n++){
        bounds.extend(decodedLine[n]);
      }
      map.fitBounds(bounds);

      routeBeginning = decodedLine[0];
      calcStartPoint();
      addMarker(decodedLine[0], map, 'A');
      addMarker(decodedLine[decodedLine.length -1], map, 'B');
      polyline.setPath(decodedLine);
      polyline.setMap(map);
       
      // Adds a marker to the map.
      function addMarker(location, map, labelVal) 
      {
      // Add the marker at the clicked location, and add the next-available label
      // from the array of alphabetical characters.
        var marker = new google.maps.Marker({
          position: location,
          label: labelVal,
          map: map
        });
        markerArray.push(marker);
      }
      
      google.maps.event.addListener(map, 'click', function(event) {
        vm.lat = event.latLng.lat();
        vm.lon = event.latLng.lng();
        calcStartPoint();
      });
      
      function calcStartPoint() {
        var length = document.getElementById('length'); //new
        var start = { lat: vm.lat, lng: vm.lon };
        
        if(startPointMarker !== null)
        {
          startPointMarker.setMap(null);
        }

        startPointMarker = new google.maps.Marker({
          position: start,
          label: 'S',
          map: map
        });

        if(startPointPolyline !== null)
        {
          startPointPolyline.setMap(null);
        }
        
        startPointPolyline = new google.maps.Polyline({
          path: [],
          strokeColor: '#0000FF',
          strokeWeight: 3
        });
        
        var directionsService = new google.maps.DirectionsService();
  
        var request = {
          origin: { lat: vm.lat, lng: vm.lon },
          destination: routeBeginning,
          travelMode: google.maps.TravelMode.WALKING, 
          provideRouteAlternatives: false
        };

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
                  startPointPolyline.getPath().push(nextSegment[k]);
                  bounds.extend(nextSegment[k]);
                }
              }
            }
  
            startPointPolyline.setMap(map);
            var originalLength = vm.location.length;
            var addedLength = google.maps.geometry.spherical.computeLength(startPointPolyline.getPath()) * 0.00062137;
            length.value = originalLength + addedLength;
          }
          else
          {
            //TODO handle this correctly, should this allow them to enter a different location?
            console.log('request failure');
          }
        });
      }
      $scope.$on('$destroy', function() {
        for (var i = 0; i < markerArray.length; i++) {
          markerArray[i].setMap(null);
        }
        polyline.setMap(null);
        startPointPolyline.setMap(null);
        markerArray = [];
        polyline.setPath([]);
        startPointPolyline.setPath([]);
        startPointMarker.setMap(null);
        startPointMarker = null;
        map = null;
      }); 
    });
    
     

  }

})();