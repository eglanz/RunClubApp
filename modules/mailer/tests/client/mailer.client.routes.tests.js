(function () {
  'use strict';
  
  describe('Mailer Route Tests', function () {
    // Initialize global variables
    var $scope;

    //We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));
    
    beforeEach(inject(function ($rootScope) {
      // Set a new global scope
      $scope = $rootScope.$new();
    }));

    describe('Route Config', function () {
      describe('Mass Mailer Create Route', function () {
        var mainstate, MailerController;
        beforeEach(inject(function ($state, $controller, $templateCache) {
          mainstate = $state.get('mailer-create');
          $templateCache.put('modules/mailer/client/views/create-mass-message.client.view', '');
          //Initialize Controller
          MailerController = $controller('MailerController as vm', {
            $scope: $scope
          });
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/mailer/create');
        });
        
        it('should respond to URL', inject(function ($state) {
          expect($state.href(mainstate)).toEqual('/mailer/create');
        }));
      });
    });
  });

})();