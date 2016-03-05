'use strict';

// Setting up route
angular.module('mailer.routes').config(['$stateProvider',
  function ($stateProvider) {
    $stateProvider
      .state('admin.mailer', {
        abstract: true,
        url: '/mailer',
        template: '<ui-view/>',
        data: {
          roles: ['admin']
        }
      })
      .state('admin.mailer-create', {
        url: '/create',
        templateUrl: 'modules/mailer/client/views/create-mass-message.client.view.html',
        controller: 'MailerController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Create Mass Message'
        }
      });
  }
]);