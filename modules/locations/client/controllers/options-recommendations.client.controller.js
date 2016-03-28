(function (){
  'use strict';

  angular
    .module('locations')
    .controller('RecommendationsOptionsController', RecommendationsOptionsController);

  RecommendationsOptionsController.$inject = ['$state'];

  function RecommendationsOptionsController($state) {
    var vm = this;
    vm.jar = jar;
    //vm.locations = $http.get()

    function jar(mile_group){
      $state.go('locations.reclist', {
        miles: mile_group
      });
    }
  }
})();

