(function () {
  'use strict';

  angular
    .module('clubevents')
    .run(menuConfig);

  menuConfig.$inject = ['Menus'];

  function menuConfig(Menus) {
    // Set top bar menu items
    Menus.addMenuItem('topbar', {
      title: 'Events',
      state: 'clubevents',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'clubevents', {
      title: 'List Events',
      state: 'clubevents.list'
    });

    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'clubevents', {
      title: 'Create Event',
      state: 'clubevents.create',
      roles: ['user']
    });
  }
})();
