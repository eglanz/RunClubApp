(function () {
  'use strict';

  describe('Training List Controller Tests', function () {
    // Initialize global variables
    var TrainingListController,
      $scope,
      $httpBackend,
      $state,
      Authentication,
      TrainingService,
      mockPlan;

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
    beforeEach(inject(function ($controller, $rootScope, _$state_, _$httpBackend_, _Authentication_, _TrainingService_) {
      // Set a new global scope
      $scope = $rootScope.$new();

      // Point global variables to injected services
      $httpBackend = _$httpBackend_;
      $state = _$state_;
      Authentication = _Authentication_;
      TrainingService = _TrainingService_;

      // create mock location
      mockPlan = new TrainingService({
        _id: '525a8422f6d0f87f0e407a33',
        race: 'Blah Half Marathon',
        url: 'www.google.com'
      });

      // Mock logged in user
      Authentication.user = {
        roles: ['user', 'admin']
      };

      // Initialize the Locations List controller.
      TrainingListController = $controller('TrainingListController as vm', {
        $scope: $scope
      });

      //Spy on state go
      spyOn($state, 'go');
    }));

    describe('Instantiate', function () {
      var mockTrainingList;

      beforeEach(function () {
        mockTrainingList = [mockPlan, mockPlan];
      });

      it('should send a GET request and return all plans', inject(function (TrainingService) {
        // Set POST response
        $httpBackend.expectGET('api/plans').respond(mockTrainingList);


        $httpBackend.flush();

        // Test form inputs are reset
        expect($scope.vm.plans.length).toEqual(2);
        expect($scope.vm.plans[0]).toEqual(mockPlan);
        expect($scope.vm.plans[1]).toEqual(mockPlan);

      }));
    });
    
   
  });
})();
