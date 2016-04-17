(function () {
  'use strict';

  angular
    .module('executives')
    .controller('ExecutivesListController', ExecutivesListController);

  ExecutivesListController.$inject = ['ExecutivesService'];

  function ExecutivesListController(ExecutivesService) {
    var vm = this;

    vm.executives = ExecutivesService.query();
  }
})();
