playlistApp.factory('Playlist',function ($cookieStore,$resource,$http) {

  var accessToken = "";
  var userName = "";
  var playlists = [];


  this.getUserPlaylists = function(){
    return $http({
      method: 'GET',
      url: 'https://api.spotify.com/v1/users/'+this.getUserId()+'/playlists?limit=50',
      headers: {'Authorization': 'Bearer ' + this.getAccessToken()}
    }).then(function successCallback(response) {
      console.log("getuserplaylists");
      var data = response.data;
      return data;
    }, function errorCallback(response) {
          console.log("gick åt hvete");
        });
    }

  //searches for "global"-playlists that we can suggest to the user
  //the queryparameter holds the selected mood and genre "energetic rock" for example
  this.searchPlaylists = function(query) {
    console.log("search playlisssttssss"+query)
    $.ajax({
      url: 'https://api.spotify.com/v1/search?q='+query+'&type=playlist&market=SE',
      headers: {
       'Authorization': 'Bearer ' + this.getAccessToken()

     },
     dataType: 'json',
     success: function(result){
      var sgPlaylists = result.playlists.items;
      console.log(result.playlists.items);
      $("#results-suggested").html("<span class='header-style1'>You might also like: </span><br />");
      for (key in sgPlaylists){
       var sgPlaylist = sgPlaylists[key];
            $("#results-suggested").append("<div class='playlist-div' style='background-image: url("+sgPlaylist.images[0].url+");'><a href='#/playlist/"+sgPlaylist.id+"/"+sgPlaylist.owner.id+"/"+sgPlaylist.name+"'><div class='playlist-div-details'>"+sgPlaylist.name+"</div></a></div>");
          }

          return result.items;
        }
      });
  }
  this.getAllPlaylists=function(){
    return playlists;
  }

    

      //gets user info of the current user
      this.getUserData = function(){
        return $http({
          method: 'GET',
          url: 'https://api.spotify.com/v1/me',
          headers: {'Authorization': 'Bearer ' + this.getAccessToken()}
        }).then(function successCallback(response) {
        var data = response.data;
        //var images = data.images;
        console.log(data);
        console.log("new version");
        //var name = data.display_name;
        //if(typeof images == 'Object'){
        //  var imageurl = images.url;
        //} else {
        // var imageurl = 'http://www.mikaeljuntti.se/app/img/user.png';
        //}
        var imageurl = 'http://www.mikaeljuntti.se/app/img/user.png';
        if(data.display_name == null){
          var name = 'Unknown user';
        } else {
          var name = data.display_name;;
        }
        var userData = [];
        //console.log("image url "+imageurl);
        userData.push(data.id,name,imageurl);
        $cookieStore.put("userData", userData);
        return userData;
        }, function errorCallback(response) {
          console.log("gick åt hvete");
        // called asynchronously if an error occurs
        // or server returns response with an error status.
        });
              }


  //get all tracks within a certain playlist
  this.getPlaylistTracks = function(playlistid){
      return $http({
      method: 'GET',
      url: 'https://api.spotify.com/v1/users/'+this.getUserId()+'/playlists/'+playlistid+'/tracks',
      headers: {'Authorization': 'Bearer ' + this.getAccessToken()}
    }).then(function(response) {
      // this callback will be called asynchronously
      // when the response is available
      var data = response.data.items;
      console.log("PlaylistTRACKresponse: "+data);
      return data;
      }, function errorCallback(response) {
      // called asynchronously if an error occurs
      // or server returns response with an error status.
      });
    }

    //get the "codestring" that spotify returns in the url after successful login
  this.getQueryString = function(name, url) {
    console.log("halleluja");
    if (!url) url = window.location.href;
    //url = url.toLowerCase(); // This is just to avoid case sensitiveness  
    name = name.replace(/[\[\]]/g, "\\$&").toLowerCase();// This is just to avoid case sensitiveness for query parameter name
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
    results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));

  }

  /*this.setAccessToken = function(token){
    accessToken = token;
    $cookieStore.put("accesstoken", token);
    console.log("accesstoken set");
  };*/

  this.setPlaylists = function(array){
    playlists = array;
  };

  this.getAccessToken = function(){
    if($cookieStore.get("accesstoken")){
      return $cookieStore.get("accesstoken");
    }else{
      return accessToken;
    }
  }

  this.getUserName = function(){
    return $cookieStore.get("userData");
  }

  this.getUserId = function(){
    var userdata = $cookieStore.get("userData");
    var userId = userdata[0];
    return userId;
  }

  //Gets the accesstoken from the API and returns it
  this.setAccessToken = function(data){
    console.log("model-setaccesstoken");
    return $http({
    url: 'requesttoken.php',
    method: 'POST',
    data: data
    }).then(function(response){
      var result = response.data;
      console.log(result);
      console.log("Access token: "+result.access_token);
      accessToken = result.access_token;
      $cookieStore.put("accesstoken", result.access_token);
      return result.access_token;
    })
  }
  //11:44
  this.createDatabase = function(userId) {
    $http({
      url: 'createdatabase.php',
      method: 'POST',
      data: {UserId:userId}
    }).then(function SuccessCallback(response){
      console.log("Database created!" + response.data)
    }, function errorCallback(response){
      console.log("Error setting up Database!");
    });
  }
  //13:41
  this.searchGenreMood = function(query){
    var userId = this.getUserId();
    return $http({
      method: 'POST',
      url: 'getplaylistfromgenre.php',
      data: {Query:query, UserId:userId}
    }).then(function SuccessCallback(response){
      var result = response.data;
      console.log("result");
      console.log(result);
      return result;
    },function errorCallback(response){
      console.log("An error occured");
    });
  }

  //get playlist from an array with id's created in the search-ctrl
    //the id's are taken from the database, this in or der to display
    //the users OWN playlists that he has tagged with the relevant mood/genre/keywords
    this.getPlaylist = function(idArray) {
    console.log("getPLaylist: "+playlists);
    for (key in playlists){
       var playlist = playlists[key];
       if(jQuery.inArray(playlist.id, idArray) !== -1)
            $("#results").append("<div class='playlist-div' style='background-image: url("+playlist.images[0].url+");'><a href='#/playlist/"+playlist.id+"/"+playlist.owner.id+"/"+playlist.name+"'><div class='playlist-div-details'>"+playlist.name+"</div></a></div>");
          }
  }
  


  this.checkIfFollowed = function(playlistid){
    console.log("checkiffollowplaylist...");

    return $http({
        url: 'https://api.spotify.com/v1/users/'+this.getUserId()+'/playlists/'+playlistid+'/followers/contains?ids='+getUserId(),
        method: 'GET',
        headers: {'Authorization': 'Bearer ' + this.getAccessToken()}
      }).then(function successCallback(response){
          result = response.data;
          console.log(response.data);
          return result;
        }, function errorCallback(response) {
          console.log("gick åt hvete");
        });

  }

    this.followPlaylist = function(playlistid){
    return $http({
      url: 'https://api.spotify.com/v1/users/'+this.getUserId()+'/playlists/'+playlistid+'/followers',
      method: 'PUT',
      headers: {'Authorization': 'Bearer ' + this.getAccessToken()}
    }).then(function SuccessCallback(response){
      result = response.data;
      console.log(response.data);
      return result;
      }, function errorCallback(response){
          console.log("ERROR! editplaylistctrl>followplaylist");
      });
  }

  //UNFOLLOWS A PLAYLIST
  this.unfollowPlaylist = function(playlistid){
    return $http({
      url: 'https://api.spotify.com/v1/users/'+this.getUserId()+'/playlists/'+playlistid+'/followers',
      method: 'DELETE',
      headers: {'Authorization': 'Bearer ' + this.getAccessToken()}
    }).then(function SuccessCallback(response){
      result = response.data;
      console.log(response.data);
      return result;
    }, function errorCallback(response){
          console.log("An error occured");
      });
  }


  return this;


});