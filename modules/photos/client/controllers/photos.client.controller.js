(function () {
  'use strict';

  angular
    .module('photos')
    .controller('PhotosController', PhotosController);

  PhotosController.$inject = ['$scope', '$state', 'photoResolve', 'Authentication','FileUploader','$timeout', '$window', 'PhotosService', 'getNames'];

  function PhotosController($scope, $state, photo, Authentication, FileUploader, $timeout, $window, PhotosService, getNames) {
    
    var vm = this;

    vm.photo = photo;
    vm.authentication = Authentication;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;
    vm.getNames = getNames;
    vm.edit = true;
    
    $scope.user = Authentication.user;
    $scope.imageURL = vm.photo.ImageURL;
    var message = document.getElementById('message');
    
    $scope.creds = {
      bucket: 'photobucketsoftwareproject',
      access_key: 'AKIAILRI2UN6EOOGN4WQ',
      secret_key: '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'
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

  document.getElementById("submitbtn").disabled = true;
  if(vm.edit){
    
      if(typeof $scope.file === 'undefined')
      {
        message.value = 'choose a file name';
        return false;
      }
  if($scope.file.size > 10585760) {
    message.value = 'Sorry, file size must be under 10MB';
    document.getElementById("submitbtn").disabled = false;
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
    AWS.config.region = 'us-west-2';
    var bucket = new AWS.S3({ params: { Bucket: $scope.creds.bucket } });
    if($scope.file) {
       var params = { Key: $scope.file.name, ContentType: $scope.file.type, Body: $scope.file, ServerSideEncryption: 'AES256' };
 
      bucket.putObject(params, function(err, data) {
      if(err) {
        // There Was An Error With Your S3 Config
        message.value = err.message;
        return false;
      }
      else {
        // Success!
        message.value = 'Upload Done';
        save();
      }
    })
    .on('httpUploadProgress',function(progress) {
          // Log Progress Information
          message.value = Math.round(progress.loaded / progress.total * 100) + '% done';
        });
  }
  else {
    // No File Selected
    message.value = 'No File Selected';
    document.getElementById("submitbtn").disabled = false;
  }
  }
  else
  {
    message.value = 'This name has been used. Rename your file.';
    document.getElementById("submitbtn").disabled = false;
  }
    }
  }
  else
  {
    save();
  }
};

   

    
            // Remove existing Photo
    function remove() {
      if (confirm('Are you sure you want to delete?')) {
        vm.photo.$remove($state.go('photos.list'));
      }
    }
    
    
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
