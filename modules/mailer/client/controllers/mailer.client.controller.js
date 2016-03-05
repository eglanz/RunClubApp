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
    
    var Mailer = $resource('api/mailer', {}, {
      massMailer: { method: 'POST' }
    });
    
    function send(isValid) {
      console.log("Calling send()");
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.massMailForm');
        return false;
      }
      else {
        // take vm.message.content and send it to all emails except those on a do-not-email list (filtering is handled on server side)
        // subject is vm.message.subject, maybe indicate somehow that it's a mass email, maybe...
        // include name of sender somehow
        
        Mailer.massMailer({},{ content: vm.message.content, subject: vm.message.subject },successCallback,errorCallback);
      }
      
      function successCallback(res) {
        console.log("Success Callback");
        $state.go($state.previous.state.name || 'home', $state.previous.params);
      }

      function errorCallback(res) {
        console.log("Error Callback");
        vm.error = res.data.message;
      }
    }
  }
})();