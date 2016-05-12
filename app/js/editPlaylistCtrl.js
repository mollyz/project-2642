playlistApp.controller('EditPlaylistCtrl', function ($scope,$routeParams,$interval,$compile,$http,Playlist) {

	$scope.playlistId = $routeParams.playlistId;
	$scope.playlistUserId = $routeParams.playlistUserId;
  	$scope.playlistName = $routeParams.playlistName;
  	$scope.playlistArrow = Playlist.getAllPlaylists();

	var isFollowed = "";

	console.log("playlistID"+$scope.playlistId);
	console.log("playlistUSERID"+$scope.playlistUserId);

	//CHECKS IF THE PLAYLIST IS FOLLOWED AND GENERATES THE FOLLOW BUTTON ACCORDINGLY (follow/unfollow)
	$scope.checkIfFollowed = function(){
		console.log("checkiffollowplaylist...");
		$http({
      	url: 'https://api.spotify.com/v1/users/'+$scope.playlistUserId+'/playlists/'+$scope.playlistId+'/followers/contains?ids='+Playlist.getUserId(),
      	method: 'GET',
      	headers: {'Authorization': 'Bearer ' + Playlist.getAccessToken()}
      }).then(function successCallback(response){
     		console.log(response.data);
     		if (response.data=="true"){
     		var $el = $("#follow-button-span").html('<button class="btn editplaylist-follow" style="background-color:#006633; color:#fff" ng-click="unfollowPlaylist()">Followed</button>');
   			$compile($el)($scope);
        	} else if (response.data=="false") {
        	var $el = $("#follow-button-span").html('<button class="btn editplaylist-follow" style="background-color:#000" ng-click="followPlaylist()">Follow</button>');
   			$compile($el)($scope);
        	}
        }, function errorCallback(response) {
          console.log("Error: check if followed");
        // called asynchronously if an error occurs
        // or server returns response with an error status.
        });

	}

	//Gets the users labels from the database
	$scope.getUserLabels = function(labeltype){
	var userId = Playlist.getUserId();
    console.log("getaUSERID "+userId);
    $http({
      method: 'POST',
      url: 'getlabels.php',
      data: {UserId:userId, LabelType: labeltype}
    }).then(function SuccessCallback(response){
      var result = response.data;
      if(labeltype=='mood'){
          $("#mood-select").html('<option value="" disabled>{{mood}}</option>');
          for(key in result){
            var $el = $("#mood-select").append('<option value="'+result[key].mood+'">'+result[key].mood+'</option>');
          }
          $compile($el)($scope);
        }else if(labeltype=='genre'){
          $("#genre-select").html('<option value="" disabled>{{genre}}</option>');
          for(key in result){
          	var $el = $("#genre-select").append('<option value="'+result[key].genre+'">'+result[key].genre+'</option>');
          }
          $compile($el)($scope);
        }
    }, function errorCallback(response){
      console.log("ERROR!");
    });
  }

	//FOLLOW A PLAYLIST
	$scope.followPlaylist = function(){
		console.log("followplaylist...");
		$http({
			url: 'https://api.spotify.com/v1/users/'+$scope.playlistUserId+'/playlists/'+$scope.playlistId+'/followers',
			method: 'PUT',
			headers: {'Authorization': 'Bearer ' + Playlist.getAccessToken()}
		}).then(function SuccessCallback(response){
			$scope.checkIfFollowed(); 
    	}, function errorCallback(response){
      		console.log("ERROR! editplaylistctrl>followplaylist");
    	});
	}

	//UNFOLLOW A PLAYLIST
	$scope.unfollowPlaylist = function(){
		console.log("unfollowplaylist...");
		$http({
			url: 'https://api.spotify.com/v1/users/'+$scope.playlistUserId+'/playlists/'+$scope.playlistId+'/followers',
			method: 'DELETE',
			headers: {'Authorization': 'Bearer ' + Playlist.getAccessToken()}
		}).then(function SuccessCallback(response){
			$scope.checkIfFollowed(); 
    	}, function errorCallback(response){
      		console.log("An error occured");
    	});
	}

	//CHECKS IF THERE IS ANY META ATTACHED TO THE PLAYLIST IN THE DATABASE
	$scope.getMeta = function(playlistId){
		var id=$scope.playlistId;
		var userid = Playlist.getUserId();
		console.log("PLaylistID: "+id);
		$http({
			method: 'POST',
			url: 'getplaylist.php',
			data: {Id:id, UserId:userid}
		}).then(function SuccessCallback(response){
			var result=response.data;
			$scope.mood=result.mood;
			$scope.genre=result.genre;
			$scope.savedkeywords=result.keywords;
			console.log("META: ");
			console.log(result);
			if(result=='zeroResults'){
				$scope.mood="Add a mood!";
				$scope.genre="Add a genre!";
				$scope.savedkeywords="Add some keywords!";
			}
    	}, function errorCallback(response){
      		console.log("An error occured: getMeta");
    	});
	}

	//GETS the spotify web-player widget
	$scope.getPlayer = function(playlistId,playlistUserId){
		$("#player-div").html("");
		playerHtml = '<iframe src="https://embed.spotify.com/?uri=spotify:user:'+playlistUserId+':playlist:'+playlistId+'" width="450" height="500" frameborder="0" allowtransparency="true"></iframe>';
		$("#player-div").append(playerHtml);
	}

	//INSERT the playlist-id together with user specified mood/genre/keywords in the backend
	$scope.insert = function(id,mood,genre,keywords){
		var id=$scope.playlistId;
		var userId=Playlist.getUserId();
		console.log("insert "+userId);
		$http({
			method: 'POST',
			url: 'insert.php',
			data: {Id:id, Mood:mood, Genre:genre, Keywords:keywords, UserId:userId}
		}).then(function SuccessCallback(response){
			alert("saved!");
			location.reload();
    	}, function errorCallback(response){
      		console.log("An error occured: getMeta");
    	});
    }
	
	$scope.getUserLabels('mood');
	$scope.getUserLabels('genre');
	$scope.getMeta($scope.playlistId);
	$scope.checkIfFollowed();
	$scope.getPlayer($scope.playlistId,$scope.playlistUserId);

});