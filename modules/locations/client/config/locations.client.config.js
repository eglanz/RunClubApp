(function () {
  'use strict';

  angular
    .module('locations')
    .run(menuConfig);

  menuConfig.$inject = ['Menus'];

  function menuConfig(Menus) {
    Menus.addMenuItem('topbar', {
      title: 'Routes',
      state: 'locations',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'locations', {
      title: 'All Routes',
      state: 'locations.list',
      roles: ['*']
    });

    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'locations', {
      title: 'Create Route',
      state: 'locations.create',
      roles: ['*']
    });
    
    //Add dropdown recommendation options
    Menus.addSubMenuItem('topbar', 'locations', {
      title: 'Get Route Recommendation',
      state: 'locations.recops',
      roles: ['*']
    });
    
    Menus.addSubMenuItem('topbar', 'locations', {
      title: 'Training Plans',
      state: 'locations.training',
      roles: ['*']
    });
    
    Menus.addSubMenuItem('topbar', 'locations', {
      title: 'Create Training Plan',
      state: 'locations.training_create',
      roles: ['admin']
    });
  }
})();
