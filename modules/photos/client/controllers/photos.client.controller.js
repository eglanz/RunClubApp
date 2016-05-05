(function () {
  'use strict';
  angular
    .module('photos')
    .controller('PhotosController', PhotosController);
 
  PhotosController.$inject = ['$scope', '$state', 'photoResolve', 'Authentication','FileUploader','$timeout', '$window', 'PhotosService', 'nameResolve', 'awsResolve'];

  function PhotosController($scope, $state, photoResolve, Authentication, FileUploader, $timeout, $window, PhotosService, nameResolve, awsResolve) {

    var vm = this;
    
    vm.photo = photoResolve;
    vm.authentication = Authentication;
    vm.error = null;
    vm.form = {};
    //vm.remove = remove;
    vm.save = save;
    vm.getNames = nameResolve;
    vm.edit = true;
    
    $scope.user = Authentication.user;
    $scope.imageURL = vm.photo.ImageURL;
    $scope.message = document.getElementById('message');
    $scope.submit = document.getElementById('submitbtn');
    

    $scope.creds = {
      bucket: awsResolve.bucket,
      access_key: awsResolve.key,
      secret_key: awsResolve.secret
    };
    
    $scope.getState = function()
    {
      if(typeof vm.photo._id !== 'undefined')
      {
        vm.edit = false;
        return false;
      }
      else
      {
        vm.edit = true;
        return true;
      }
    };
 
    vm.upload = function(isValid) {
  
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.photoForm');
        return false;
      }

      $scope.submit.disabled = true;
      if(vm.edit){
    
        if(typeof $scope.file === 'undefined')
        {
          $scope.message.value = 'choose a file name';
          return false;
        }
        if($scope.file.size > 10585760) {
          $scope.message.value = 'Sorry, file size must be under 10MB';
          $scope.submit.disabled = false;
          return false;
        }else{
          var unique = true;
          for(var val in vm.getNames)
          {
            if(vm.getNames[val].ImageURL === $scope.file.name)
            {
              unique = false;
            }
          }
          if(unique)
          {
            // Configure The S3 Object 
            AWS.config.update({ accessKeyId: $scope.creds.access_key, secretAccessKey: $scope.creds.secret_key });
            AWS.config.region = awsResolve.region;
            var bucket = new AWS.S3({ params: { Bucket: $scope.creds.bucket } });
            if($scope.file) {
              var params = { Key: $scope.file.name, ContentType: $scope.file.type, Body: $scope.file, ServerSideEncryption: 'AES256' };
 
              bucket.putObject(params, function(err, data) {
                if(err) {
                  // There Was An Error With Your S3 Config
                  $scope.message.value = err.message;
                  return false;
                }
                else {
                  // Success!
                  $scope.message.value = 'Upload Done';
                  save();
                }
              })
              .on('httpUploadProgress',function(progress) {
                // Log Progress Information
                $scope.message.value = Math.round(progress.loaded / progress.total * 100) + '% done';
              });
            }
            else {
              // No File Selected
              $scope.message.value = 'No File Selected';
              $scope.submit.disabled = false;
            }
          }
          else
          {
            $scope.message.value = 'This name has been used. Rename your file.';
            $scope.submit.disabled = false;
          }
        }
      }
      else
      {
        save();
      }
    };

    
    /*// Remove existing Photo
    function remove() {
      if (confirm('Are you sure you want to delete?')) {
        vm.photo.$remove($state.go('photos.list'));
      }
    }*/
    
    
    function successCallback(res) {
      $state.go('photos.view', {
        photoId: res._id
      });
    }

    function errorCallback(res) {
      vm.error = res.data.message;
    }

    // Save Photo
    function save() {
      // TODO: move create/update logic to service
      if (vm.photo._id) {
        vm.photo.$update(successCallback, errorCallback);
      } else {
        vm.photo.ImageURL = $scope.file.name;
        vm.photo.$save(successCallback, errorCallback);
      }

    }
  }
})();
