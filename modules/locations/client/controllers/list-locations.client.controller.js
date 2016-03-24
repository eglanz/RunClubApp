(function (){
  'use strict';

  angular
    .module('locations')
    .controller('LocationsListController', LocationsListController);

  LocationsListController.$inject = ['LocationsService', '$state', 'Authentication', 'LikeService', 'UnLikeService'];

  function LocationsListController(LocationsService, $state, Authentication, LikeService, UnLikeService) {
    var vm = this;

    vm.locations = LocationsService.query();
    vm.clickview = clickview;
    vm.like = like;
    vm.unlike = unlike;
    vm.likebuttons = [];
    vm.unlikebuttons = [];
    //console.log(vm.locations[1].isLiked);
    
    function clickview(id){
        $state.go('locations.view', {
          locationId: id
        });
    }
    
    function like(id){
      for(var location in vm.locations){
        if(vm.locations[location] && vm.locations[location]._id === id){
          LikeService.query({locationId: id});
          if(vm.unlikebuttons.isEmpty || vm.unlikebuttons.indexOf(id) === -1){
            vm.unlikebuttons.push(id);
            if(vm.likebuttons.indexOf(id) > -1){
              vm.likebuttons.splice(vm.likebuttons.indexOf(id), 1);
            }
          }
        }
      }
    }
    
    function callback(){
      $state.go('locations.list');
    }

    function unlike(id){
        for(var location in vm.locations){
        if(vm.locations[location] && vm.locations[location]._id === id){
          UnLikeService.query({locationId: id});
          
          if(vm.likebuttons.isEmpty || vm.likebuttons.indexOf(id) === -1){
            vm.likebuttons.push(id);
            if(vm.unlikebuttons.indexOf(id) > -1){
              vm.unlikebuttons.splice(vm.unlikebuttons.indexOf(id), 1);
            }
          }
        }
      }
      }
  }
})();

