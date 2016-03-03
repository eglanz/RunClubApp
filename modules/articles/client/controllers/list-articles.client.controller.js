(function () {
  'use strict';

  angular
    .module('articles')
    .controller('ArticlesListController', ArticlesListController);

  ArticlesListController.$inject = ['ArticlesService', 'ArticlesService2'];

  function ArticlesListController(ArticlesService, ArticlesService2) {
    var vm = this;
    vm.jar = jar;
    vm.text;
    
    console.log("EH");
    
    vm.articles = ArticlesService.query();
    
    function jar(){
      console.log("HEY!");
      vm.text = "WHAT";
      vm.text = ArticlesService2.get();
    }
  }
  
  
})();
