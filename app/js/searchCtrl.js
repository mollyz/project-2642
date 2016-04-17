playlistApp.controller('SearchCtrl', function ($scope,Playlist) {


  $scope.search = function(){
  	console.log("search");
  	$scope.playlists = Playlist.getUserPlaylists(Playlist.getAccessToken(),$scope.getAllPlaylistsFromDatabase());
  	console.log($scope.playlists);
  }

  //searches by genre
  $scope.searchGenreMood = function(query){
    //console.log(query);
    $.ajax({
      type: 'POST',
      url: 'getplaylistfromgenre.php',
      dataType: 'json',
      data: {Query:query},
      success: function(result){
        //console.log("result");
        //console.log(result);
        var array = []
        for(key in result){
          array.push(result[key].id);
        }
        //console.log(array);
        Playlist.getPlaylist(array,query);
        Playlist.searchPlaylists(query);


      },
      error: function(){
        $("#results").html("<span class='errormsg'>You don't have any playlists tagged as '"+query+"'. Check out the ones below!</span>");
        Playlist.searchPlaylists(query);


      }

    });
  }

  //gets all of users playlists
  //gets an array of id's in DB 
  $scope.getAllPlaylists = function(){
    //console.log(query);
    $.ajax({
      type: 'POST',
      url: 'getplaylist.php',
      dataType: 'json',
      success: function(result){
        console.log("result get ALL");
        console.log(result);
        var array = []
        for(key in result){
          array.push(result[key].id);
        }
      Playlist.getUserPlaylists(Playlist.getAccessToken(),array)
      },
      error: function(){
        console.log("ERROR!");

      }

    });
  }


  Playlist.getUserData();
  $scope.getAllPlaylists();


});