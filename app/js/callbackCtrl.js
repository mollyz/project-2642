playlistApp.controller('CallbackCtrl', function ($scope,Playlist,$location) {

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
  	var redirect_uri = "http%3A%2F%2Flocalhost%3A8888%2Fproject%2Fapp%2Findex.html%23%2Fcallback";
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
      Playlist.getUserData();
      $scope.$apply(function() { $location.path("/search"); });

    }


  });

  	/*$.post("https://accounts.spotify.com/api/token",
    {
        grant_type: grant_type,
        code: code,
        redirect_uri: redirect_uri
    },
    function(data, status){
        alert("Data: " + data + "\nStatus: " + status);
    });
*/
	}



});