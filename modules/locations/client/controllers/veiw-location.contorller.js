(function (){
  'use strict';

  angular
    .module('locations')
    .controller('LocationsViewController', LocationsViewController);

  LocationsViewController.$inject = ['$scope', '$state', 'locationResolve', 'Authentication'];

  function LocationsViewController($scope, $state, location, Authentication) {
    var vm = this;
    vm.location = location;
    
    var polyline;
    var decodedLine;
    var markerArray = [];
    //https://developers.google.com/maps/documentation/javascript/reference#encoding
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

       addMarker(decodedLine[0], map, 'A');
       addMarker(decodedLine[decodedLine.length -1], map, 'B');

       polyline.setPath(decodedLine);
       polyline.setMap(map);
       
                     // Adds a marker to the map.
      function addMarker(location, map, labelVal) {
        // Add the marker at the clicked location, and add the next-available label
        // from the array of alphabetical characters.
        var marker = new google.maps.Marker({
          position: location,
          label: labelVal,
          map: map
        });
        markerArray.push(marker);
       }
     });
  }
  
  
   /*$scope.$on("$destroy", function(){
        //clearInterval(myInterval);
        //alert("destroying");
        polyline.setMap(null);
        for (var i = 0; i < markerArray.length; i++) {
          markerArray[i].setMap(null);
        }
        
    });*/
})();