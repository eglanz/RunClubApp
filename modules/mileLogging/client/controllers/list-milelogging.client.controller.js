(function () {
  'use strict';

  angular
    .module('milelogging')
    .controller('MileloggingListController', MileloggingListController);

  MileloggingListController.$inject = ['MileloggingService', '$scope', 'uiCalendarConfig', '$compile', 'GetUser', 'Authentication', '$state', 'userResolve'];

  function MileloggingListController(MileloggingService, $scope, uiCalendarConfig, $compile, GetUser, Authentication, $state, userResolve) {
    var vm = this;
    
    vm.authentication = Authentication;
    var length = document.getElementById('length'); //new
    vm.length = 0;
    vm.user = userResolve;
    console.log(vm.user._id);
    
    vm.milelogs = MileloggingService.query({ 'user': vm.user });
    vm.milelogs.$promise.then(function (result) {

    });

     
         // alert on eventClick 
    $scope.alertOnEventClick = function(date, jsEvent, view){
      $scope.alertMessage = (date.title + ' was clicked ');
      $state.go('milelogging.view', {
        mileloggingId: date._id
      });
    };
    //alert on Drop 
    $scope.alertOnDrop = function(event, delta, revertFunc, jsEvent, ui, view){
      $scope.alertMessage = ('Event Droped to make dayDelta ' + delta);
    };
    // alert on Resize 
    $scope.alertOnResize = function(event, delta, revertFunc, jsEvent, ui, view){
      $scope.alertMessage = ('Event Resized to make dayDelta ' + delta);
    };

    //remove event 
    $scope.remove = function(index) {
      $scope.events.splice(index,1);
    };
    // Change View
    $scope.changeView = function(view,calendar) {
      uiCalendarConfig.calendars[calendar].fullCalendar('changeView',view);
      
    };
    // Change View 
    $scope.renderCalender = function(calendar) {
      if(uiCalendarConfig.calendars[calendar]){
        uiCalendarConfig.calendars[calendar].fullCalendar('render');
      }
      length.value = vm.length + ' miles';
    };
     // Render Tooltip 
    $scope.eventRender = function(event,element,view) { 
      vm.length = vm.length + event.length;
      length.value = vm.length;
      element.attr({ 'tooltip': event.date,
        'tooltip-append-to-body': true });
      $compile(element)($scope);
    };
    
    $scope.viewRendering = function(){
      vm.length = 0;
      length.value = vm.length;
    };
    


    vm.milelogging = [MileloggingService.query({ user: vm.userid })];
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
        eventRender: $scope.eventRender,
        viewRender: $scope.viewRendering
      }
    };
    


  
  }
})();
