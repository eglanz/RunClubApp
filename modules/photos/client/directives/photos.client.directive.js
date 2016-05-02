'use strict';

angular.module('photos')
.directive('file', function() {
        return {
        restrict: 'AE',
        scope: {
        file: '@'
         },
         link: function(scope, el, attrs){
           el.bind('change', function(event){
             var files = event.target.files;
             var file = files[0];
            scope.file = file;
            scope.$parent.file = file;
            scope.$apply();
           });
         }
       };
    })
    
    .directive('validFile',function(){
    return {
        require:'ngModel',
        link:function(scope,el,attrs,ctrl){
            ctrl.$setValidity('validFile', el.val() !== '');
            //change event is fired when file is selected
            el.bind('change',function(){
                ctrl.$setValidity('validFile', el.val() !== '');
                scope.$apply(function(){
                    ctrl.$setViewValue(el.val());
                    ctrl.$render();
                });
            });
        }
    };
});