(function () {
  'use strict';

  describe('Photos Controller Tests', function () {
    // Initialize global variables
    var PhotosControllerView,
      $scope,
      $httpBackend,
      $state,
      Authentication,
      PhotosService,
      mockPhoto;

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

    /*beforeEach(function(){
      module('photos.services');

      GetAWS = {
        currentItem : '123'
      };
      GetNames = {
        currentItem : '123'
      };
      
      

    });*/
    

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($controller, $rootScope, _$state_, _$httpBackend_, _Authentication_, _PhotosService_) {
      // Set a new global scope
      $scope = $rootScope.$new();


      // Point global variables to injected services
      $httpBackend = _$httpBackend_;
      $state = _$state_;
      Authentication = _Authentication_;
      PhotosService = _PhotosService_;

      // create mock photo
      mockPhoto = new PhotosService({
        _id: '525a8422f6d0f87f0e407a33',
        title: 'An Photo about MEAN',
        content: 'MEAN rocks!',
        ImageURL: 'something'
      });

      // Mock logged in user
      Authentication.user = {
        roles: ['user']
      };

      // Initialize the Photos controller.
      PhotosControllerView = $controller('PhotosControllerView as vm', {
        $scope: $scope,
        photoResolve: {},
        nameResolve: {},
        awsResolve: {}
      });

      //Spy on state go
      spyOn($state, 'go');
    }));

    /*describe('vm.save() as create', function () {
      var samplePhotoPostData;

      beforeEach(function () {
        // Create a sample photo object
        samplePhotoPostData = new PhotosService({
        
          title: 'An Photo about MEAN',
          content: 'MEAN rocks!',
          ImageURL: 'url'
        });

        $scope.vm.photo = samplePhotoPostData;
      });

      it('should send a POST request with the form input values and then locate to new object URL', inject(function (PhotosService) {
        var fakeFile = { name: 'example.txt' };
        $scope.file = fakeFile;
        // Set POST response
        $httpBackend.expectPOST('api/photos', samplePhotoPostData).respond(mockPhoto);

        // Run controller functionality
        $scope.vm.save(true);
        $httpBackend.flush();

        // Test URL redirection after the photo was created
        expect($state.go).toHaveBeenCalledWith('photos.view', {
          photoId: mockPhoto._id
        });
      }));

      it('should set $scope.vm.error if error', function () {
        var fakeFile = { name: 'example.txt' };
        $scope.file = fakeFile;
        var errorMessage = 'this is an error message';
        $httpBackend.expectPOST('api/photos', samplePhotoPostData).respond(400, {
          message: errorMessage
        });

        $scope.vm.save(true);
        $httpBackend.flush();

        expect($scope.vm.error).toBe(errorMessage);
      });
    });*/

    /*describe('vm.save() as update', function () {
      beforeEach(function () {
        // Mock photo in $scope
        $scope.vm.photo = mockPhoto;
      });

      it('should update a valid photo', inject(function (PhotosService) {
        // Set PUT response
        $httpBackend.expectPUT(/api\/photos\/([0-9a-fA-F]{24})$/).respond();

        // Run controller functionality
        $scope.vm.save(true);
        $httpBackend.flush();

        // Test URL location to new object
        expect($state.go).toHaveBeenCalledWith('photos.view', {
          photoId: mockPhoto._id
        });
      }));

      it('should set $scope.vm.error if error', inject(function (PhotosService) {
        var errorMessage = 'error';
        $httpBackend.expectPUT(/api\/photos\/([0-9a-fA-F]{24})$/).respond(400, {
          message: errorMessage
        });

        $scope.vm.save(true);
        $httpBackend.flush();

        expect($scope.vm.error).toBe(errorMessage);
      }));
    });*/

    describe('vm.remove()', function () {
      beforeEach(function () {
        //Setup photos
        $scope.vm.photo = mockPhoto;
      });

      it('should delete the photo and redirect to photos', function () {
        //Return true on confirm message
        spyOn(window, 'confirm').and.returnValue(true);
        $httpBackend.expectGET(/api\/photo\/key$/).respond({ KEY: 'asldfajsld', SECRET: 'asldkj' });
        $httpBackend.expectDELETE(/api\/photos\/([0-9a-fA-F]{24})$/).respond(204);

        $scope.vm.remove();
        $httpBackend.flush();

        expect($state.go).toHaveBeenCalledWith('photos.list');
      });

      it('should should not delete the photo and not redirect', function () {
        //Return false on confirm message
        spyOn(window, 'confirm').and.returnValue(false);

        $scope.vm.remove();

        expect($state.go).not.toHaveBeenCalled();
      });
    });
  });
})();
