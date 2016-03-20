(function (){
  'use strict';

  angular
    .module('locations')
    .controller('RecommendationsListController', RecommendationsListController);

  RecommendationsListController.$inject = ['$state', '$stateParams', 'RecommendationsService'];

  function RecommendationsListController($state, $stateParams, RecommendationsService) {
    var vm = this;
    vm.miles = $stateParams.miles
    vm.words = "GETTING RESULTS...";
    vm.locations = RecommendationsService.query({miles: vm.miles});
    vm.words = "";
  }
})();