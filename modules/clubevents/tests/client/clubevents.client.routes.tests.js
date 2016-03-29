(function () {
  'use strict';

  describe('Clubevents Route Tests', function () {
    // Initialize global variables
    var $scope,
      ClubeventsService;

    //We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _ClubeventsService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      ClubeventsService = _ClubeventsService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('clubevents');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/clubevents');
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
          ClubeventsController,
          mockClubevent;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('clubevents.view');
          $templateCache.put('modules/clubevents/client/views/view-clubevent.client.view.html', '');

          // create mock Clubevent
          mockClubevent = new ClubeventsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Clubevent Name'
          });

          //Initialize Controller
          ClubeventsController = $controller('ClubeventsController as vm', {
            $scope: $scope,
            clubeventResolve: mockClubevent
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:clubeventId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.clubeventResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            clubeventId: 1
          })).toEqual('/clubevents/1');
        }));

        it('should attach an Clubevent to the controller scope', function () {
          expect($scope.vm.clubevent._id).toBe(mockClubevent._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/clubevents/client/views/view-clubevent.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          ClubeventsController,
          mockClubevent;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('clubevents.create');
          $templateCache.put('modules/clubevents/client/views/form-clubevent.client.view.html', '');

          // create mock Clubevent
          mockClubevent = new ClubeventsService();

          //Initialize Controller
          ClubeventsController = $controller('ClubeventsController as vm', {
            $scope: $scope,
            clubeventResolve: mockClubevent
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.clubeventResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/clubevents/create');
        }));

        it('should attach an Clubevent to the controller scope', function () {
          expect($scope.vm.clubevent._id).toBe(mockClubevent._id);
          expect($scope.vm.clubevent._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/clubevents/client/views/form-clubevent.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          ClubeventsController,
          mockClubevent;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('clubevents.edit');
          $templateCache.put('modules/clubevents/client/views/form-clubevent.client.view.html', '');

          // create mock Clubevent
          mockClubevent = new ClubeventsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Clubevent Name'
          });

          //Initialize Controller
          ClubeventsController = $controller('ClubeventsController as vm', {
            $scope: $scope,
            clubeventResolve: mockClubevent
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:clubeventId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.clubeventResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            clubeventId: 1
          })).toEqual('/clubevents/1/edit');
        }));

        it('should attach an Clubevent to the controller scope', function () {
          expect($scope.vm.clubevent._id).toBe(mockClubevent._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/clubevents/client/views/form-clubevent.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
})();
