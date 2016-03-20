(function () {
  'use strict';

  describe('Recommendations Options Controller Tests', function () {
    // Initialize global variables
    var RecommendationsOptionsController,
      $scope,
      $httpBackend,
      $state,
      Authentication,
      LocationsService,
      RecommendationsService,
      mockLocation;

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
    beforeEach(inject(function ($controller, $rootScope, _$state_, _$httpBackend_, _Authentication_, _LocationsService_, _RecommendationsService_) {
      // Set a new global scope
      $scope = $rootScope.$new();

      // Point global variables to injected services
      $httpBackend = _$httpBackend_;
      $state = _$state_;
      Authentication = _Authentication_;
      LocationsService = _LocationsService_;

      // create mock article
      mockLocation = new LocationsService({
        _id: '525a8422f6d0f87f0e407a33',
        name: 'DisneyLand',
        content: 'egi~FhfcvOajCcyA',
        length: 5.1,
        hills: 1,
        scenic: 3,
        traffic: 4,
        overall:3
      });

      // Mock logged in user
      Authentication.user = {
        roles: ['user']
      };

      // Initialize the Locations controller.
      RecommendationsOptionsController = $controller('RecommendationsOptionsController as vm', {
        $scope: $scope
      });

      //Spy on state go
      spyOn($state, 'go');
    }));

    describe('vm.jar() as redirect', function () {
      

      it('should redirect to recommendations page', inject(function () {
        // Set POST response
        
        var mile_group = 1;
        $scope.vm.jar(mile_group);
        $httpBackend

        expect($state.go).toHaveBeenCalledWith('locations.reclist', {
          miles: mile_group
        });
    }))
    });

  });
 
})();
