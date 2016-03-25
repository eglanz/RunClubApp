(function () {
  'use strict';

  describe('Recommendations List Controller Tests', function () {
    // Initialize global variables
    var RecommendationsListController,
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
      RecommendationsService = _RecommendationsService_;

      // create mock location
      mockLocation = new LocationsService({
        _id: '525a8422f6d0f87f0e407a33AliceInWonderland',
        name: 'Narnia',
        content: 'egi~FhfcvOajCcyAKetchup',
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


      var stateparams = { miles: 2 };
      // Initialize the Locations List controller.
      RecommendationsListController = $controller('RecommendationsListController as vm', {
        $scope: $scope,
        $stateParams: stateparams
      });

      //Spy on state go
      spyOn($state, 'go');
    }));

    describe('Instantiate', function () {
      var mockLocationList;

      beforeEach(function () {
        mockLocationList = [mockLocation, mockLocation];
      });

      it('should send a GET request and return all locations', inject(function (RecommendationsService) {
        // Set POST response
        $httpBackend.expectGET('api/locations/jar/2').respond(mockLocationList);


        $httpBackend.flush();

        // Test form inputs are reset
        expect($scope.vm.locations.length).toEqual(2);

      }));
    });
  });
})();
