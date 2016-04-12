playlistApp.controller('HeaderCtrl', function ($scope,Playlist) {
  console.log("headerCTRL");
  //$scope.username = Playlist.getUserName();

  $scope.getUserinfo = function(){
		//console.log("getting user details..");
		Playlist.getUserData().then(function(data){
				//console.log("userdetails: "+data)
				$scope.userinfo=data;
			});
	}

  $scope.getUserinfo();

});