(function () {
  'use strict';

  angular
    .module('mailer')
    .controller('MailerController', MailerController);

  MailerController.$inject = ['$scope', '$state', '$resource', 'Authentication'];

  function MailerController($scope, $state, $resource, Authentication) {
    var vm = this;

    vm.message = {};
    vm.authentication = Authentication;
    vm.error = null;
    vm.form = {};
    vm.send = send;
    
    var Mailer = $resource('api/massmailer', {}, {
      massMailer: { method: 'POST' }
    });
    
    function send(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.massMailForm');
        return false;
      }
      else {
        Mailer.massMailer({},{ content: vm.message.content, subject: vm.message.subject },successCallback,errorCallback);
      }
      
      function successCallback(res) {
        //$state.go($state.previous.state.name || 'home', $state.previous.params);
        alert('Mail sent.');
        $state.go('home', $state.previous.params);
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
})();