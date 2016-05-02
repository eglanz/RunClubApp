(function () {
  'use strict';

  angular
    .module('photos')
    .controller('PhotosControllerView', PhotosControllerView);

  PhotosControllerView.$inject = ['$scope', '$state', 'photoResolve', 'Authentication','FileUploader','$timeout', '$window'];

  function PhotosControllerView($scope, $state, photo, Authentication, FileUploader, $timeout, $window) {
    
    var vm = this;

    vm.photo = photo;
    vm.authentication = Authentication;
    vm.error = null;
    vm.remove = remove;
    
        $scope.creds = {
      bucket: 'photobucketsoftwareproject',
      access_key: 'AKIAILRI2UN6EOOGN4WQ',
      secret_key: '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'
    };
    
                // Remove existing Article
    function remove() {

      if (confirm('Are you sure you want to delete?')) {
        AWS.config.update({ accessKeyId: $scope.creds.access_key, secretAccessKey: $scope.creds.secret_key });
        AWS.config.region = 'us-west-2';

        var bucket = new AWS.S3({ params: { Bucket: $scope.creds.bucket } });
        var params = {  Bucket: 'photobucketsoftwareproject', Key: vm.photo.ImageURL };
        bucket.deleteObject(params, function(err, data) {
            if (err) alert('not deleted');  // error
            else     alert('deleted');                 // deleted
         });
        vm.photo.$remove($state.go('photos.list'));
      }
    }

    
    $scope.user = Authentication.user;
    $scope.imageURL = vm.photo.ImageURL;//vm.imageURL;//$scope.user.profileImageURL;
    $scope.src = 'https://s3-us-west-2.amazonaws.com/photobucketsoftwareproject/' + vm.photo.ImageURL;//Chrysanthemum.jpg';
    
    /*$scope.creds = {
      bucket: 'photobucketsoftwareproject',
      access_key: 'AKIAILRI2UN6EOOGN4WQ',
      secret_key: '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'
    };
    
    AWS.config.update({ accessKeyId: $scope.creds.access_key, secretAccessKey: $scope.creds.secret_key });
    AWS.config.region = 'us-west-2';
    var params = { Key: vm.photo.ImageURL}, ServerSideEncryption: 'AES256' };
    //AWS.config.region = "Oregon";
    var bucket = new AWS.S3({ params: { Bucket: $scope.creds.bucket } });
    //$scope.s3Url = 'https://s3-<region>.amazonaws.com/myBucket/';
    //var bucket = new AWS.S3({params: {Bucket: 'myBucket'}});
      // bucket.listObjects(function (err, data) {
      bucket.getObject(params, function(err, data) {
       if (err) {
          console.log(err);
        } else {
        console.log(data);
        $scope.allImageData = data.Contents;
       }
     });*/
   }
})();
