(function () {
  'use strict';

  angular
    .module('articles.services')
    .factory('ArticlesService', ArticlesService)
    .factory('ArticlesService2', ArticlesService2);

  ArticlesService.$inject = ['$resource'];

  function ArticlesService($resource) {
    return $resource('api/articles/:articleId', {
      articleId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
  
  function ArticlesService2($resource){
    return $resource('api/articles/jar',{
    });
  }
})();
