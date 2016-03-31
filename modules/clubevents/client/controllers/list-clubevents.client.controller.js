(function () {
  'use strict';

  angular
    .module('clubevents')
    .controller('ClubeventsListController', ClubeventsListController);

  ClubeventsListController.$inject = ['ClubeventsService', '$scope', 'uiCalendarConfig', '$compile'];

  function ClubeventsListController(ClubeventsService, $scope, uiCalendarConfig, $compile) {
    var vm = this;
    
    vm.clubevents = [ClubeventsService.query()];
    vm.eventSources = [];
    
    /* config object */
    $scope.uiConfig = {
      calendar:{
        height: 600,
        editable: true,
        header:{
          left: 'month basicWeek agendaDay',
          center: 'title',
          right: 'today prev,next'
        },
        displayEventEnd: true,
        timezone: 'local',
        dayClick: $scope.alertEventOnClick,
        eventClick: $scope.alertOnEventClick,
        eventDrop: $scope.alertOnDrop,
        eventResize: $scope.alertOnResize,
        eventRender: $scope.eventRender
      }
    };
    
    /* alert on eventClick */
    $scope.alertOnEventClick = function(date, jsEvent, view){
      $scope.alertMessage = (date.title + ' was clicked ');
    };
    /* alert on Drop */
    $scope.alertOnDrop = function(event, delta, revertFunc, jsEvent, ui, view){
      $scope.alertMessage = ('Event Droped to make dayDelta ' + delta);
    };
    /* alert on Resize */
    $scope.alertOnResize = function(event, delta, revertFunc, jsEvent, ui, view){
      $scope.alertMessage = ('Event Resized to make dayDelta ' + delta);
    };

    /* remove event */
    $scope.remove = function(index) {
      $scope.events.splice(index,1);
    };
    /* Change View */
    $scope.changeView = function(view,calendar) {
      uiCalendarConfig.calendars[calendar].fullCalendar('changeView',view);
    };
    /* Change View */
    $scope.renderCalender = function(calendar) {
      if(uiCalendarConfig.calendars[calendar]){
        uiCalendarConfig.calendars[calendar].fullCalendar('render');
      }
    };
     /* Render Tooltip */
    $scope.eventRender = function(event,element,view) { 
      element.attr({ 'tooltip': event.title,
        'tooltip-append-to-body': true });
      $compile(element)($scope);
    };
  }
})();
