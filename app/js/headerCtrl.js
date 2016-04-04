playlistApp.controller('HeaderCtrl', function ($scope,Playlist) {
  console.log("headerCTRL");
  $scope.username = Playlist.getUserName();
  

});