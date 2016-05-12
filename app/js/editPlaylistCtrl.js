playlistApp.controller('EditPlaylistCtrl', function ($scope,$routeParams,$interval,$compile,$http,Playlist) {

	$scope.playlistId = $routeParams.playlistId;
	$scope.playlistUserId = $routeParams.playlistUserId;
  	$scope.playlistName = $routeParams.playlistName;
  	$scope.playlistArrow = Playlist.getAllPlaylists();

	var isFollowed = "";

	console.log("playlistID"+$scope.playlistId);
	console.log("playlistUSERID"+$scope.playlistUserId);

	/*$scope.getTracks = function(playlistId){
		console.log("getting tracks..");
		Playlist.getPlaylistTracks(playlistId).then(function(data){
			$scope.playlist=data;
		});
	}*/

	$scope.getUserLabels = function(userId,labeltype){
    $scope.userLabel="";
    Playlist.getUserLabels(userId,labeltype)
	.then(function SuccessCallback(response){
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

	$scope.getPlayer = function(playlistId,playlistUserId){
		$("#player-div").html("");
		playerHtml = '<iframe src="https://embed.spotify.com/?uri=spotify:user:'+playlistUserId+':playlist:'+playlistId+'" width="450" height="500" frameborder="0" allowtransparency="true"></iframe>';
		$("#player-div").append(playerHtml);
	}

	//FIX HTTP
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

	$scope.getPlayer = function(playlistId,playlistUserId){
		$("#player-div").html("");
		playerHtml = '<iframe src="https://embed.spotify.com/?uri=spotify:user:'+playlistUserId+':playlist:'+playlistId+'" width="450" height="500" frameborder="0" allowtransparency="true"></iframe>';
		$("#player-div").append(playerHtml);
	}

	//FIX HTTP
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

	/*$scope.follow = function(playlistId){
		var id= $scope.playlistId;
		$scope.followStatus = Playlist.checkIfFollowed(id);
		console.log(followStatus)
		$scope.checkResult = $scope.followStatus.result;
		console.log(checkResult)
		if (checkResult == true){
			Playlist.unfollowPlaylist(id);
		}
		else Playlist.followPlaylist(id);
	}*/


	$scope.checkIfFollowed = function(playlistId){
		var id= $scope.playlistId;
		var ownerId=$scope.playlistUserId;
		Playlist.checkIfFollowed(id,ownerId).then(function successCallback(result){
			console.log("11111111111111111111");
        	console.log(result);
        	if (result=="true"){
        		var $el = $("#follow-button-span").html('<button class="btn editplaylist-follow" style="background-color:#006633; color:#fff" ng-click="unfollowPlaylist()">Followed</button>');
        		$compile($el)($scope);
          	} else if (result=="false") {
          		var $el = $("#follow-button-span").html('<button class="btn editplaylist-follow" style="background-color:#000" ng-click="followPlaylist()">Follow</button>');
        		$compile($el)($scope);
          	}
        	}, function errorCallback(result) {
          		console.log("gick åt hvete");
      			console.log(result);
			});
		}

	$scope.followPlaylist = function(playlistId){
		var id= $scope.playlistId;
		var ownerId=$scope.playlistUserId;
		Playlist.followPlaylist(id,ownerId).then(function successCallback(result){
        	console.log("1111111111111111111122222222222");
        	console.log(result);
        	$scope.checkIfFollowed(id); 
        }, function errorCallback(result){
          console.log("ERROR! editplaylistctrl>followplaylist");
      	});
      }

	$scope.unfollowPlaylist = function(playlistId){
		var id= $scope.playlistId;
		var ownerId=$scope.playlistUserId;
		Playlist.unfollowPlaylist(id,ownerId).then(function successCallback(result){
        	console.log("111111111111111111112222222222233333333");
        	console.log(result);
        	$scope.checkIfFollowed(id); 
        }, function errorCallback(result){
          console.log("ERROR! editplaylistctrl>followplaylist");
      	});
      }

		/*$.ajax({
			type: 'POST',
			url: 'insert.php',
			data: {Id:id, Mood:mood, Genre:genre, Keywords:keywords, UserId:userId},
			success: function(result){
				alert("saved!");
				location.reload();
			},
			error: function(){
				alert('error saving order');
			}
		});*/
	

	$scope.getUserLabels('mood');
	$scope.getUserLabels('genre');
	$scope.getMeta($scope.playlistId);
	//$scope.getTracks($scope.playlistId);
	$scope.checkIfFollowed();
	$scope.getPlayer($scope.playlistId,$scope.playlistUserId);



});