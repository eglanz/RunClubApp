(function () {
  'use strict';

  describe('Clubevents Controller Tests', function () {
    // Initialize global variables
    var ClubeventsController,
      $scope,
      $httpBackend,
      $state,
      Authentication,
      ClubeventsService,
      mockClubevent;

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
    beforeEach(inject(function ($controller, $rootScope, _$state_, _$httpBackend_, _Authentication_, _ClubeventsService_) {
      // Set a new global scope
      $scope = $rootScope.$new();

      // Point global variables to injected services
      $httpBackend = _$httpBackend_;
      $state = _$state_;
      Authentication = _Authentication_;
      ClubeventsService = _ClubeventsService_;

      // create mock Clubevent
      mockClubevent = new ClubeventsService({
        _id: '525a8422f6d0f87f0e407a33',
        title: 'Clubevent Name',
        start: new Date(),
        end: new Date()
      });

      // Mock logged in user
      Authentication.user = {
        roles: ['user']
      };

      // Initialize the Clubevents controller.
      ClubeventsController = $controller('ClubeventsController as vm', {
        $scope: $scope,
        clubeventResolve: {}
      });

      //Spy on state go
      spyOn($state, 'go');
    }));

    describe('vm.save() as create', function () {
      var sampleClubeventPostData;

      beforeEach(function () {
        // Create a sample Clubevent object
        sampleClubeventPostData = new ClubeventsService({
          title: 'Clubevent Name'
        });

        $scope.vm.clubevent = sampleClubeventPostData;
      });
    });

    describe('vm.save() as update', function () {
      beforeEach(function () {
        // Mock Clubevent in $scope
        $scope.vm.clubevent = mockClubevent;
      });

      it('should set $scope.vm.error if error', inject(function (ClubeventsService) {
        var errorMessage = 'error';
        $httpBackend.expectPUT(/api\/clubevents\/([0-9a-fA-F]{24})$/).respond(400, {
          message: errorMessage
        });

        $scope.vm.save(true);
        $httpBackend.flush();

        expect($scope.vm.error).toBe(errorMessage);
      }));
    });

    describe('vm.remove()', function () {
      beforeEach(function () {
        //Setup Clubevents
        $scope.vm.clubevent = mockClubevent;
      });

      it('should delete the Clubevent and redirect to Clubevents', function () {
        //Return true on confirm message
        spyOn(window, 'confirm').and.returnValue(true);

        $httpBackend.expectDELETE(/api\/clubevents\/([0-9a-fA-F]{24})$/).respond(204);

        $scope.vm.remove();
        $httpBackend.flush();

        expect($state.go).toHaveBeenCalledWith('clubevents.list');
      });

      it('should should not delete the Clubevent and not redirect', function () {
        //Return false on confirm message
        spyOn(window, 'confirm').and.returnValue(false);

        $scope.vm.remove();

        expect($state.go).not.toHaveBeenCalled();
      });
    });
  });
})();
