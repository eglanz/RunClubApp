(function () {
  'use strict';

  angular
    .module('photos')
    .run(menuConfig);

  menuConfig.$inject = ['Menus'];

  function menuConfig(Menus) {
    Menus.addMenuItem('topbar', {
      title: 'Club Photos',
      state: 'photos',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'photos', {
      title: 'Photos',
      state: 'photos.list',
      roles: ['user', 'admin']
    });

    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'photos', {
      title: 'Add Photo',
      state: 'photos.create',
      roles: ['user', 'admin']
    });
  }
})();
