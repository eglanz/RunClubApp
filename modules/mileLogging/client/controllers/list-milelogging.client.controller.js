(function () {
  'use strict';

  angular
    .module('milelogging')
    .controller('MileloggingListController', MileloggingListController);

  MileloggingListController.$inject = ['MileloggingService', '$scope', 'uiCalendarConfig', '$compile', 'GetUser', 'Authentication', '$state', 'userResolve'];

  function MileloggingListController(MileloggingService, $scope, uiCalendarConfig, $compile,  GetUser, Authentication, $state, userResolve) {
    var vm = this;
    
    vm.authentication = Authentication;
    var length = document.getElementById('length'); //new
    vm.length = 0;
    vm.total = 0;
    vm.user = userResolve;
    console.log( vm.user._id );
    
    vm.milelogs = MileloggingService.query( {'user': vm.user});
    //console.log(vm.milelogs.isCurrentUse);
    vm.milelogs.$promise.then(function (result) {

    });

     
         // alert on eventClick 
    $scope.alertOnEventClick = function(date, jsEvent, view){
      console.log('alertOnEventClick');
      $scope.alertMessage = (date.title + ' was clicked ');
    };
    //alert on Drop 
    $scope.alertOnDrop = function(event, delta, revertFunc, jsEvent, ui, view){
      console.log('alertmessage');
      $scope.alertMessage = ('Event Droped to make dayDelta ' + delta);
    };
    // alert on Resize 
    $scope.alertOnResize = function(event, delta, revertFunc, jsEvent, ui, view){
      console.log('resize');
      $scope.alertMessage = ('Event Resized to make dayDelta ' + delta);
    };

    //remove event 
    $scope.remove = function(index) {
      console.log('remove');
      $scope.events.splice(index,1);
    };
    // Change View
    $scope.changeView = function(view,calendar) {
      vm.length = 0;
      console.log('changeView');
      uiCalendarConfig.calendars[calendar].fullCalendar('changeView',view);
      
    };
    // Change View 
    $scope.renderCalender = function(calendar) {
      console.log('renderCalender');
      vm.length = 0;
      if(uiCalendarConfig.calendars[calendar]){
        uiCalendarConfig.calendars[calendar].fullCalendar('render');
      }
      length.value = vm.length + 'space' + vm.total;
      console.log(vm.total);
    };
     // Render Tooltip 
    $scope.eventRender = function(event,element,view) { 
      vm.total = vm.total + 1;
      //console.log('eventRender' + vm.total);
      vm.length = vm.length + event.length;
      //length.value = event.length;
      element.attr({ 'tooltip': event.date,
        'tooltip-append-to-body': true });
      $compile(element)($scope);
    };

    vm.milelogging = [MileloggingService.query(/*{ user: vm.userid}*/)];
    vm.eventSources = [];
    
    // object 
    $scope.uiConfig = {
      calendar:{
        height: 600,
        editable: true,
        header:{
          left: 'month basicWeek agendaDay',
          center: 'title',
          right: 'today prev,next'
        },
        displayEventEnd: false,
        timezone: 'local',
        dayClick: $scope.alertEventOnClick,
        eventClick: $scope.alertOnEventClick,
        eventDrop: $scope.alertOnDrop,
        eventResize: $scope.alertOnResize,
        eventRender: $scope.eventRender
        /*eventClick: $scope.alertOnEventClick,
        eventDrop: $scope.alertOnDrop,
        eventResize: $scope.alertOnResize,
        eventRender: $scope.eventRender*/
      }
    };


  
  }
})();
