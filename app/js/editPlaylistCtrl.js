playlistApp.controller('EditPlaylistCtrl', function ($scope,$routeParams,$interval,Playlist) {

  // TODO in Lab 5: you will need to implement a method that searchers for dishes
  // including the case while the search is still running.

  $scope.playlistId = $routeParams.playlistId;
  $scope.playlistUserId = $routeParams.playlistUserId;
  $scope.playlistName = $routeParams.playlistName;


  console.log("playlistID"+$scope.playlistId);
    console.log("playlistUSERID"+$scope.playlistUserId);


  //$scope.playlist = Playlist.getPlaylistTracks($scope.playlistId);
  //$apply();
	$scope.getTracks = function(playlistId){
		console.log("getting tracks..");
		Playlist.getPlaylistTracks(playlistId).then(function(data){
				$scope.playlist=data;
			});
	}

	$scope.getMeta = function(playlistId){
		var id=$scope.playlistId;
		$.ajax({
			type: 'POST',
			url: 'getplaylist.php',
			dataType: 'json',
			data: {Id:id},
			success: function(result){
				var data=result;
				$scope.mood=result.mood;
				$scope.genre=result.genre;
				console.log("META: "+result);

			},
			error: function(){
				$scope.mood="No meta found!";
				$scope.genre="No meta found!";

			}

		});
	}

	$scope.getPlayer = function(playlistId,playlistUserId){
		$("#player-div").html("");
		playerHtml = '<iframe src="https://embed.spotify.com/?uri=spotify:user:'+playlistUserId+':playlist:'+playlistId+'" width="450" height="500" frameborder="0" allowtransparency="true"></iframe>';
		$("#player-div").append(playerHtml);
	}

	$scope.insert = function(id,mood,genre,keywords){
		var id=$scope.playlistId;
		console.log("insert");
		$.ajax({
			type: 'POST',
			url: 'insert.php',
			data: {Id:id, Mood:mood, Genre:genre, Keywords:keywords},
			success: function(result){
				alert("saved!");
				location.reload();

			},
			error: function(){
				alert('error saving order');
			}

		});

	}
	$scope.getMeta($scope.playlistId);
	$scope.getPlayer($scope.playlistId,$scope.playlistUserId);
	$scope.getTracks($scope.playlistId);
});