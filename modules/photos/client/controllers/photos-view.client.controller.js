(function () {
  'use strict';

  angular
    .module('photos')
    .controller('PhotosControllerView', PhotosControllerView);

  PhotosControllerView.$inject = ['$scope', '$state', 'Authentication','photoResolve', 'FileUploader','$timeout', '$window', '$http'];

  function PhotosControllerView($scope, $state, Authentication, photoResolve, FileUploader, $timeout, $window, $http, photo) {
    
    var vm = this;
    vm.photo = photoResolve;
    vm.authentication = Authentication;
    vm.error = null;
    vm.remove = remove;
    
    $scope.creds = {
      bucket: '',
      access_key: '',
      secret_key: ''
    };
    
    function remove() {

      if (confirm('Are you sure you want to delete?')) {
        $http.get('/api/photo/key').success(function(data) {
          $scope.creds = {
            bucket: 'photobucketsoftwareproject',
            access_key: data.KEY,
            secret_key: data.SECRET
          };
        
          AWS.config.update({ accessKeyId: $scope.creds.access_key, secretAccessKey: $scope.creds.secret_key });
          AWS.config.region = 'us-west-2';

          var bucket = new AWS.S3({ params: { Bucket: $scope.creds.bucket } });
          var params = { Bucket: 'photobucketsoftwareproject', Key: vm.photo.ImageURL };
          bucket.deleteObject(params, function(err, data) {
            /*if (err) alert('not deleted');  // error
            else     alert('deleted'); // deleted*/
          });
          vm.photo.$remove($state.go('photos.list'));
        });
      }
    }

    
    $scope.user = Authentication.user;
    $scope.imageURL = vm.photo.ImageURL;
    $scope.src = 'https://s3-' + 'us-west-2' + '.amazonaws.com/' + 'photobucketsoftwareproject' + '/' + vm.photo.ImageURL;
  }
})();
