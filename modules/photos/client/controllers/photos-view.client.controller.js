(function () {
  'use strict';

  angular
    .module('photos')
    .controller('PhotosControllerView', PhotosControllerView);

  PhotosControllerView.$inject = ['$scope', '$state', 'Authentication','photoResolve', 'awsResolve', 'FileUploader','$timeout', '$window', '$http'/*, 'getAWS'*/];

  function PhotosControllerView($scope, $state, Authentication, photoResolve, awsResolve, FileUploader, $timeout, $window, $http/*, getAWS*/, photo) {
    
    var vm = this;
    vm.photo = photoResolve;
    vm.authentication = Authentication;
    vm.error = null;
    vm.remove = remove;
    
    $scope.creds = {
      bucket: awsResolve.bucket,
      access_key: awsResolve.key,
      secret_key: awsResolve.secret
    };
    
    function remove() {

      if (confirm('Are you sure you want to delete?')) {
        AWS.config.update({ accessKeyId: $scope.creds.access_key, secretAccessKey: $scope.creds.secret_key });
        AWS.config.region = awsResolve.region;

        var bucket = new AWS.S3({ params: { Bucket: $scope.creds.bucket } });
        var params = { Bucket: awsResolve.bucket, Key: vm.photo.ImageURL };
        bucket.deleteObject(params, function(err, data) {
          /*if (err) alert('not deleted');  // error
          else     alert('deleted'); // deleted*/
        });
        vm.photo.$remove($state.go('photos.list'));
      }
    }

    
    $scope.user = Authentication.user;
    $scope.imageURL = vm.photo.ImageURL;
    $scope.src = 'https://s3-' + awsResolve.region + '.amazonaws.com/' + awsResolve.bucket + '/' + vm.photo.ImageURL;
  }
})();
