(function () {
  'use strict';

  describe('Executives Controller Tests', function () {
    // Initialize global variables
    var ExecutivesController,
      $scope,
      $httpBackend,
      $state,
      Authentication,
      ExecutivesService,
      mockExecutive;

    // The $resource service augments the response object with methods for updating and deleting the resource.
    // If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
    // the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
    // When the toEqualData matcher compares two objects, it takes only object properties into
    // account and ignores methods.
    beforeEach(function () {
      jasmine.addMatchers({
        toEqualData: function (util, customEqualityTesters) {
          return {
            compare: function (actual, expected) {
              return {
                pass: angular.equals(actual, expected)
              };
            }
          };
        }
      });
    });

    // Then we can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($controller, $rootScope, _$state_, _$httpBackend_, _Authentication_, _ExecutivesService_) {
      // Set a new global scope
      $scope = $rootScope.$new();

      // Point global variables to injected services
      $httpBackend = _$httpBackend_;
      $state = _$state_;
      Authentication = _Authentication_;
      ExecutivesService = _ExecutivesService_;

      // create mock exec
      mockExecutive = new ExecutivesService({
        _id: '525a8422f6999d99ff93',
        firstName: 'Ham',
        lastName: 'Sandwich',
        email: 'ham.sandwich@email.com',
        descript: 'Better than the turkey sandwich?'
      });

      // Mock logged in user
      Authentication.user = {
        roles: ['user', 'admin']
      };

      // Initialize the Executives controller.
      ExecutivesController = $controller('ExecutivesController as vm', {
        $scope: $scope,
        executiveResolve: {}
      });

      //Spy on state go
      spyOn($state, 'go');
    }));

    describe('vm.save() as create', function () {
      var sampleExecutivePostData;

      beforeEach(function () {
        // Create a sample executive object
        sampleExecutivePostData = new ExecutivesService({
          firstName: 'Ham',
          lastName: 'Sandwich',
          email: 'ham.sandwich@email.com',
          descript: 'Better than the turkey sandwich?'
        });

        $scope.vm.executive = sampleExecutivePostData;
      });

      it('should send a POST request with the form input values and then locate to new object URL', inject(function (ExecutivesService) {
        // Set POST response
        $httpBackend.expectPOST('api/executives', sampleExecutivePostData).respond(mockExecutive);

        // Run controller functionality
        $scope.vm.save(true);
        $httpBackend.flush();

        // Test URL redirection after the exec was created
        expect($state.go).toHaveBeenCalledWith('executives.view', {
          executiveId: mockExecutive._id
        });
      }));

      it('should set $scope.vm.error if error', function () {
        var errorMessage = 'this is an error message';
        $httpBackend.expectPOST('api/executives', sampleExecutivePostData).respond(400, {
          message: errorMessage
        });

        $scope.vm.save(true);
        $httpBackend.flush();

        expect($scope.vm.error).toBe(errorMessage);
      });
    });

    describe('vm.save() as update', function () {
      beforeEach(function () {
        // Mock executive in $scope
        $scope.vm.executive = mockExecutive;
      });

      it('should update a valid executive', inject(function (ExecutivesService) {
        // Set PUT response
        console.log('I AM HERE');
        $httpBackend.expectPUT(/api\/executives\/([0-9a-fA-F]{24})$/).respond();

        // Run controller functionality
        $scope.vm.save(true);
        $httpBackend.flush();

        // Test URL location to new object
        expect($state.go).toHaveBeenCalledWith('executives.view', {
          articleId: mockExecutive._id
        });
      }));

      it('should set $scope.vm.error if error', inject(function (ExecutivesService) {
        var errorMessage = 'error';
        $httpBackend.expectPUT(/api\/executives\/([0-9a-fA-F]{24})$/).respond(400, {
          message: errorMessage
        });

        $scope.vm.save(true);
        $httpBackend.flush();

        expect($scope.vm.error).toBe(errorMessage);
      }));
    });

    describe('vm.remove()', function () {
      beforeEach(function () {
        //Setup executives
        $scope.vm.executive = mockExecutive;
      });

      it('should delete the executive and redirect to executives', function () {
        //Return true on confirm message
        spyOn(window, 'confirm').and.returnValue(true);

        $httpBackend.expectDELETE(/api\/executives\/([0-9a-fA-F]{24})$/).respond(204);

        $scope.vm.remove();
        $httpBackend.flush();

        expect($state.go).toHaveBeenCalledWith('executives.list');
      });

      it('should should not delete the executive and not redirect', function () {
        //Return false on confirm message
        spyOn(window, 'confirm').and.returnValue(false);

        $scope.vm.remove();

        expect($state.go).not.toHaveBeenCalled();
      });
    });
  });
})();
