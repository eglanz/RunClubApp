(function () {
  'use strict';

  angular
    .module('chat')
    .run(menuConfig);

  menuConfig.$inject = ['Menus'];

  function menuConfig(menuService) {
    // Set top bar menu items
    menuService.addMenuItem('topbar', {
      title: 'Group Chat',
      state: 'chat'
    });
  }
}());
