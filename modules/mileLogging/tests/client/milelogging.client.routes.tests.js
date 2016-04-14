(function () {
  'use strict';

  describe('Milelogging Route Tests', function () {
    // Initialize global variables
    var $scope,
      MileloggingService;

    //We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _MileloggingService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      MileloggingService = _MileloggingService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('milelogging');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/milelogging');
        });

        it('Should be abstract', function () {
          expect(mainstate.abstract).toBe(true);
        });

        it('Should have template', function () {
          expect(mainstate.template).toBe('<ui-view/>');
        });
      });

      describe('View Route', function () {
        var viewstate,
          MileloggingController,
          mockMilelogging;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('milelogging.view');
          $templateCache.put('modules/milelogging/client/views/view-milelogging.client.view.html', '');

          // create mock milelogging
          mockMilelogging = new MileloggingService({
            _id: '525a8422f6d0f87f0e407a33',
            title: '5 miles',
            length: '5'
          });

          //Initialize Controller
          MileloggingController = $controller('MileloggingController as vm', {
            $scope: $scope,
            mileloggingResolve: mockMilelogging
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:mileloggingId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.mileloggingResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            mileloggingId: 1
          })).toEqual('/milelogging/1');
        }));

        it('should attach a milelogging to the controller scope', function () {
          expect($scope.vm.milelogging._id).toBe(mockMilelogging._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/milelogging/client/views/view-milelogging.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          MileloggingController,
          mockMilelogging;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('milelogging.create');
          $templateCache.put('modules/milelogging/client/views/form-milelogging.client.view.html', '');

          // create mock milelogging
          mockMilelogging = new MileloggingService();

          //Initialize Controller
          MileloggingController = $controller('MileloggingController as vm', {
            $scope: $scope,
            mileloggingResolve: mockMilelogging
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.mileloggingResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/milelogging/create');
        }));

        it('should attach an milelogging to the controller scope', function () {
          expect($scope.vm.milelogging._id).toBe(mockMilelogging._id);
          expect($scope.vm.milelogging._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/milelogging/client/views/form-milelogging.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          MileloggingController,
          mockMilelogging;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('milelogging.edit');
          $templateCache.put('modules/milelogging/client/views/form-milelogging.client.view.html', '');

          // create mock milelogging
          mockMilelogging = new MileloggingService({
            _id: '525a8422f6d0f87f0e407a33',
            title: '5 miles',
            length: '5'
          });

          //Initialize Controller
          MileloggingController = $controller('MileloggingController as vm', {
            $scope: $scope,
            mileloggingResolve: mockMilelogging
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:mileloggingId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.mileloggingResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            mileloggingId: 1
          })).toEqual('/milelogging/1/edit');
        }));

        it('should attach an milelogging to the controller scope', function () {
          expect($scope.vm.milelogging._id).toBe(mockMilelogging._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/milelogging/client/views/form-milelogging.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
})();
