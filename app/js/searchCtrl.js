playlistApp.controller('SearchCtrl', function ($scope,Playlist) {


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

  $scope.searchGenre = function(genre){
    var query = genre;
    //console.log(query);
    $.ajax({
      type: 'POST',
      url: 'getplaylistfromgenre.php',
      dataType: 'json',
      data: {Genre:query},
      success: function(result){
        //console.log("result");
        //console.log(result);
        var array = []
        for(key in result){
          array.push(result[key].id);
        }
        //console.log(array);
        Playlist.getPlaylist(array,genre);
        Playlist.searchPlaylists(genre);


      },
      error: function(){
        console.log("ERROOOORRR");

      }

    });
  }
  $scope.search();


  /*$scope.getQuerystring = function() {
  	console.log("foooo");
  	var grant_type = "authorization_code";
  	var code = Playlist.getQueryString('code');
  	var redirect_uri = "http%3A%2F%2Flocalhost%2Fproject%2Fapp%2Findex.html%23%2Fsearch";
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

    }
  });

  	$scope.search();

  	/*$.post("https://accounts.spotify.com/api/token",
    {
        grant_type: grant_type,
        code: code,
        redirect_uri: redirect_uri
    },
    function(data, status){
        alert("Data: " + data + "\nStatus: " + status);
    });

	}
*/


});