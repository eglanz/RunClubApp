(function () {
  'use strict';

  angular
    .module('executives')
    .run(menuConfig);

  menuConfig.$inject = ['Menus'];

  function menuConfig(Menus) {
    Menus.addMenuItem('topbar', {
      title: 'Meet the Board',
      state: 'executives',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'executives', {
      title: 'Run Club Leadership',
      state: 'executives.list'
    });

    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'executives', {
      title: 'Add Leader',
      state: 'executives.create',
      roles: ['admin']
    });
  }
})();
