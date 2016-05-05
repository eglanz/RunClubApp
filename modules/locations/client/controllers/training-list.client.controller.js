(function (){
  'use strict';

  angular
    .module('locations')
    .controller('TrainingListController', TrainingListController);

  TrainingListController.$inject = ['$state', '$stateParams', 'TrainingService', '$window', 'Authentication'];

  function TrainingListController($state, $stateParams, TrainingService, $window, Authentication) {
    var vm = this;

    vm.follow = follow;
    vm.plans = TrainingService.query();
    vm.remove = remove;
    vm.user = Authentication.user;
    vm.isAdmin = true;
    
    if(vm.user === null || vm.user.roles.indexOf('admin') === -1){
      vm.isAdmin = false;
    }
    
    function follow(url){
      $window.location.href = url;
    }
    
    function remove(plan) {
      if (confirm('Are you sure you want to delete?')) {
        plan.$remove($state.go('locations.training', { }, { reload: true }));
      } 
    }
    
  }
})();