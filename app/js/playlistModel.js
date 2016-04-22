playlistApp.factory('Playlist',function ($cookieStore,$resource,$http) {

  var accessToken = "";
  var userName = "";
  var playlists = [];
  //var dishes = [];

  //gets all the playlists of the current user
  this.getUserPlaylists = function(accessToken,idArray) {
    console.log("playmodel id array" + idArray);
    $.ajax({
      url: 'https://api.spotify.com/v1/users/'+this.getUserId()+'/playlists?limit=50',
      headers: {
       'Authorization': 'Bearer ' + accessToken

     },
     dataType: 'json',
     success: function(result){
      $("#results").html("<span class='header-style1'>Your playlists:</span><br />");

      playlists = result.items;
      console.log(playlists);
      for (key in playlists){
      var playlist = playlists[key];
      var editedhtml="";
          if(jQuery.inArray(playlist.id, idArray) !== -1){
            editedhtml="<div class='div-edited'></div>";
          }
           /* for (key in playlist.images){
              var image = playlist.images[key]
              console.log(image.url);
            }*/
            $("#results").append("<div id='playlist-div' style='background-image: url("+playlist.images[0].url+");'>"+editedhtml+"<a href='#/playlist/"+playlist.id+"/"+playlist.owner.id+"/"+playlist.name+"'><span id='playlist-div-span'>"+playlist.name+"</span></a></div>");
          }

          return result.items;
        }
      });
  }

  this.getFollowCheck = function(playlistId,playlistOwner) {
    var userData=this.getUserName();
    var username=userData[1];
    
    var en_url=encodeURIComponent(username);
    console.log("eb_url"+en_url);
    ///////大问题：空格如何转成加号？？？？？？

    $.ajax({
      url: 'https://api.spotify.com/v1/users/'+playlistOwner+'/playlists/'+playlistId+'/followers/contains?ids='+en_url,
      headers: {
       'Authorization': 'Bearer ' + accessToken

     },
     dataType: 'json',
     success: function(result){
      console.log("result");
      console.log(result);
      }
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
           /* for (key in playlist.images){
              var image = playlist.images[key]
              console.log(image.url);
            }*/
            $("#results-suggested").append("<div id='playlist-div' style='background-image: url("+sgPlaylist.images[0].url+");'><a href='#/playlist/"+sgPlaylist.id+"/"+sgPlaylist.owner.id+"/"+sgPlaylist.name+"'><span id='playlist-div-span'>"+sgPlaylist.name+"</span></a></div>");
          }

          return result.items;
        }
      });
  }

   this.getAllPlaylists=function(){
      return playlists;
    }
    //get playlist from an array with id's created in the search-ctrl
    //the id's are taken from the database, this in order to display
    //the users OWN playlists that he has tagged with the relevant mood/genre/keywords
    this.getPlaylist = function(idArray,genre) {
    //console.log(idArray);
    $("#results").html("<span class='header-style1'>Your playlists tagged as "+genre+":</span><br />");
    for (key in playlists){
       var playlist = playlists[key];
       if(jQuery.inArray(playlist.id, idArray) !== -1)
           /* for (key in playlist.images){
              var image = playlist.images[key]
              console.log(image.url);
            }*/
            $("#results").append("<div id='playlist-div' style='background-image: url("+playlist.images[0].url+");'><a href='#/playlist/"+playlist.id+"/"+playlist.owner.id+"/"+playlist.name+"'><span id='playlist-div-span'>"+playlist.name+"</span></a></div>");
          }
  }

      //gets user info of the current user
      this.getUserData = function(){
        return $http({
          method: 'GET',
          url: 'https://api.spotify.com/v1/me',
          headers: {'Authorization': 'Bearer ' + this.getAccessToken()}
        }).then(function successCallback(response) {
        // this callback will be called asynchronously
        // when the response is available
        var data = response.data;
        var name = data.display_name;
        var userData = [];
        console.log("image url "+data.images[0].url);
        userData.push(data.id,data.display_name,data.images[0].url);
        $cookieStore.put("userData", userData);
        return data;
        }, function errorCallback(response) {
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

  this.setAccessToken = function(token){
    accessToken = token;
    $cookieStore.put("accesstoken", token);
    console.log("accesstoken set");
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

  return this;

});