(function () {
  'use strict';

  describe('Milelogging List Controller Tests', function () {
    // Initialize global variables
    var MileloggingListController,
      $scope,
      $httpBackend,
      $state,
      $resource,
      Authentication,
      MileloggingService,
      mockMilelogging1,
      mockMilelogging2,
      mockCalander, 
      GetUser;

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
    beforeEach(inject(function ($controller, $rootScope, _$state_, _$httpBackend_, _Authentication_, _MileloggingService_) {
      // Set a new global scope
      $scope = $rootScope.$new();

      // Point global variables to injected services
      $httpBackend = _$httpBackend_;
      $state = _$state_;
      Authentication = _Authentication_;
      MileloggingService = _MileloggingService_;
      
      // Mock logged in user
      Authentication.user = {
        roles: ['user'],
        _id: '123'
      };

      // create mock milelogging
      mockMilelogging1 = new MileloggingService({
        _id: '525a8422f6d0f87f0e407a33',
        title: '5 miles',
        length: '5',
        date: Date.now(),
        allDay: true,
        user: Authentication.user._id
      });
      
            // create mock milelogging
      mockMilelogging2 = new MileloggingService({
        _id: '425a8422f6d0f87f0e407a34',
        title: '10 miles',
        length: '10',
        date: Date.now(), 
        allDay: true,
        user: Authentication.user._id
      });
      
      mockCalander = new MileloggingService({
        fullCalendar: {}
      });

      // Initialize the Milelogging List controller.
      MileloggingListController = $controller('MileloggingListController as vm', {
        $scope: $scope,
        userResolve: Authentication.user._id
      });

      //Spy on state go
      spyOn($state, 'go');
    }));

    describe('Instantiate', function () {
      var mockMileloggingList;
      var mockCalanderList;

      beforeEach(function () {
        mockMileloggingList = [ [mockMilelogging1], [mockMilelogging2] ];
        mockCalanderList = [mockCalander];
      });

      it('should send a GET request and return all milelogging', inject(function (ArticlesService) {
        // Set POST response
        
        $httpBackend.expectGET('api/milelogging?user=' + Authentication.user._id).respond([Authentication.user]);//mockMileloggingList);
        
        $httpBackend.expectGET('api/milelogging').respond(mockMileloggingList);


        $httpBackend.flush();

        // Test form inputs are reset
        expect($scope.vm.milelogging[0][0][0]).toEqual(mockMilelogging1);
        expect($scope.vm.milelogging[0][1][0]).toEqual(mockMilelogging2);

      }));
      it('should change the alert message and redirect to a page for a single mile logger when an event is clicked on', inject(function(ArticlesService){
        $scope.alertOnEventClick(mockMilelogging1, null, null);
        
        expect($scope.alertMessage === mockMilelogging1.title + ' was clicked ');
        expect($state.go).toHaveBeenCalledWith('milelogging.view', { mileloggingId: mockMilelogging1._id });
      }));
      it('should change the alert message when a milelog is dropped', inject(function(MileloggingService){
        var delta = 'value';
        $scope.alertOnDrop(null, delta, null, null, null, null);
        
        expect($scope.alertMessage === 'Event Droped to make dayDelta ' + delta);
      }));
      it('should change the alert message when a milelog is resized', inject(function(MileloggingService){
        var delta = 'value';
        $scope.alertOnDrop(null, delta, null, null, null, null);
        
        expect($scope.alertMessage === 'Event Resized to make dayDelta ' + delta);
      }));
      it('remove the element when a remove click is done', inject(function(MileloggingService){
        var index = 0;
        $scope.alertOnDrop(index);
        
        //$scope.events.splice(index, 1);
        
        //expect($scope.events.splice).toHaveBeenCalledWith(index, 1 );
      }));
      /*it('should change the calendar view', inject(function(ArticlesService){
        //console.log($scope.uiConfig.calendar);
        var uiCalendarConfig = {
          calendars: mockCalanderList
        };
        $scope.changeView(null, 0);
      }));
      it('should render the calendar', inject(function(ArticlesService){
        $scope.renderCalender(null, null);
      }));  */
      /*it('should render an event', inject(function(ArticlesService){
        //var lengthVal = vm.length;
        $scope.eventRender(mockMilelogging1, null, null);
        //expect(vm.length === lengthVal + mockMilelogging1.length);
      })); */
     // it('should return the user when calling getUser', inject(function(MileloggingService){
       // GetUser($resource);
      //}));
      
      
      
    });
  });
})();
