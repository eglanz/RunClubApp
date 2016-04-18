(function () {
  'use strict';

  describe('Executives Route Tests', function () {
    // Initialize global variables
    var $scope,
      ExecutivesService;

    //We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _ExecutivesService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      ExecutivesService = _ExecutivesService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('executives');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/executives');
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
          ExecutivesController,
          mockExecutive;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('executives.view');
          $templateCache.put('modules/executives/client/views/view-executive.client.view.html', '');

          // create mock executive
          mockExecutive = new ExecutivesService({
            _id: '525a8422f6d0f876e407a33',
            firstName: 'Ham',
            lastName: 'Sandwich',
            email: 'ham.sandwich@email.com',
            descript: 'Better than the turkey sandwich?'
          });

          //Initialize Controller
          ExecutivesController = $controller('ExecutivesController as vm', {
            $scope: $scope,
            executiveResolve: mockExecutive
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:executiveId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.executiveResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            executiveId: 1
          })).toEqual('/executives/1');
        }));

        it('should attach an executive to the controller scope', function () {
          expect($scope.vm.executive._id).toBe(mockExecutive._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/executives/client/views/view-executive.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          ExecutivesController,
          mockExecutive;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('executives.create');
          $templateCache.put('modules/executives/client/views/form-executive.client.view.html', '');

          // create mock exec
          mockExecutive = new ExecutivesService();

          //Initialize Controller
          ExecutivesController = $controller('ExecutivesController as vm', {
            $scope: $scope,
            executiveResolve: mockExecutive
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.executiveResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/executives/create');
        }));

        it('should attach an executive to the controller scope', function () {
          expect($scope.vm.executive._id).toBe(mockExecutive._id);
          expect($scope.vm.executive._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/executives/client/views/form-executive.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          ExecutivesController,
          mockExecutive;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('executives.edit');
          $templateCache.put('modules/executives/client/views/form-executive.client.view.html', '');

          // create mock executive
          mockExecutive = new ExecutivesService({
            _id: '525a8422f6d0f87f0e407a33',
            firstName: 'Ham',
            lastName: 'Sandwich',
            email: 'ham.sandwich@email.com',
            descript: 'Better than the turkey sandwich?'
          });

          //Initialize Controller
          ExecutivesController = $controller('ExecutivesController as vm', {
            $scope: $scope,
            executiveResolve: mockExecutive
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:executiveId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.executiveResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            executiveId: 1
          })).toEqual('/executives/1/edit');
        }));

        it('should attach an executive to the controller scope', function () {
          expect($scope.vm.executive._id).toBe(mockExecutive._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/executives/client/views/form-executive.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
})();
