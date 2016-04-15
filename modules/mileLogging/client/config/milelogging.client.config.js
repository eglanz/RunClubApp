(function () {
  'use strict';

  angular
    .module('milelogging')
    .run(menuConfig);

  menuConfig.$inject = ['Menus'];

  function menuConfig(Menus) {
    Menus.addMenuItem('topbar', {
      title: 'Mile Logging',
      state: 'milelogging',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'milelogging', {
      title: 'Mile Logging',
      state: 'milelogging.list'
    });

    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'milelogging', {
      title: 'Add Miles',
      state: 'milelogging.create'
    });
  }
})();
