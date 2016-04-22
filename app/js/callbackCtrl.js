playlistApp.controller('CallbackCtrl', function ($scope,Playlist,$location) {

  var userId = "";

  $scope.sleep = function sleep(miliseconds) {
   var currentTime = new Date().getTime();

   while (currentTime + miliseconds >= new Date().getTime()) {
   }
  }

  $scope.search = function(){
  	console.log("search");
  	$scope.playlists = Playlist.getUserPlaylists(Playlist.getAccessToken());
  	console.log($scope.playlists);
  	/*
  	Playlist.PlaylistSearch.get(function(data){
	    $scope.playlists=data.Results;
	    $scope.status = "Showing " + data.Results.length + " results";
	    console.log(data.Results);
	   	$('#loading').hide();

	     //$scope.status = "Showing " + data.Results.length + " results";
	   	},function(data){
	    $scope.status = "There was an error";
	   	});
	*/
  }

  $scope.getQuerystring = function () {
  	console.log("foooo");
  	var grant_type = "authorization_code";
  	var code = Playlist.getQueryString('code');
  	var redirect_uri = "http%3A%2F%2Flocalhost%2Fproject%2Fapp%2Findex.html%23%2Fcallback";
  	console.log("CODE: "+code);

  	$.ajax({
    url: 'requesttoken.php',
    type: 'POST',
    dataType: 'json',
    data: {Grant_type:grant_type,Code:code,Redirect_uri:redirect_uri},
    success: function(result){

      console.log("Access token: "+result.access_token);
      Playlist.setAccessToken(result.access_token);
      $scope.access_token = result.access_token;

      Playlist.getUserData().then(function(data){
        console.log(data);
        console.log(data.id);
        $scope.userinfo=data.id;
        $scope.createDatabase($scope.userinfo);
        $location.path("/search");
      });

      //$scope.createDatabase(Playlist.getUserId());
      //$scope.$apply(function() { $location.path("/search"); });

    }


  });
	}

  $scope.createDatabase = function(userId) {
    console.log("create database as: "+userId);

    $.ajax({
    url: 'createdatabase.php',
    type: 'POST',
    data: {UserId:userId},
    success: function(result){

      console.log("Database created!" + result);

    }


  });
  }



});