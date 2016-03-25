(function (){
  'use strict';

  angular
    .module('locations')
    .controller('RecommendationsListController', RecommendationsListController);

  RecommendationsListController.$inject = ['$state', '$stateParams', 'RecommendationsService'];

  function RecommendationsListController($state, $stateParams, RecommendationsService) {
    var vm = this;
    vm.miles = $stateParams.miles;
    vm.clickview = clickview;
    vm.locations = RecommendationsService.query({ miles: vm.miles });
    
    function clickview(id){
      $state.go('locations.view', {
        locationId: id
      });
    }
  }
})();