(function () {
  'use strict';

  angular
    .module('mailer')
    .run(menuConfig);

  menuConfig.$inject = ['Menus'];

  function menuConfig(Menus) {
    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'admin', {
      title: 'Send Mass Email',
      state: 'admin.mailer-create',
      roles: ['admin']
    });
  }
})();
