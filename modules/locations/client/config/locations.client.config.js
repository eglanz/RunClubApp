(function () {
  'use strict';

  angular
    .module('locations')
    .run(menuConfig);

  menuConfig.$inject = ['Menus'];

  function menuConfig(Menus) {
    Menus.addMenuItem('topbar', {
      title: 'Locations',
      state: 'locations',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'locations', {
      title: 'Locations',
      state: 'locations.list'
    });

    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'locations', {
      title: 'Create Location',
      state: 'locations.create',
      roles: ['*']
    });
  }
})();
