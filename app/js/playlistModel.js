playlistApp.factory('Playlist',function ($cookieStore,$resource,$http) {

  var accessToken = "";
  var userName = "";
  var playlists = [];
  //var dishes = [];

  //gets all the playlists of the current user
  this.getUserPlaylists = function(accessToken) {
    var username = 
    $.ajax({
      url: 'https://api.spotify.com/v1/users/'+this.getUserId()+'/playlists?limit=50',
      headers: {
       'Authorization': 'Bearer ' + accessToken

     },
     dataType: 'json',
     success: function(result){
      $("#results").html("<h3>Your playlists:</h3>");

      playlists = result.items;
      console.log(playlists);
      for (key in playlists){
       var playlist = playlists[key];
           /* for (key in playlist.images){
              var image = playlist.images[key]
              console.log(image.url);
            }*/
            $("#results").append("<div id='playlist-div' style='background-image: url("+playlist.images[0].url+");'><a href='#/playlist/"+playlist.id+"/"+playlist.owner.id+"'><span id='playlist-div-span'>"+playlist.name+"</span></a></div>");
          }

          return result.items;
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
      $("#results-suggested").html("<h3>You might also like: </h3>");
      for (key in sgPlaylists){
       var sgPlaylist = sgPlaylists[key];
           /* for (key in playlist.images){
              var image = playlist.images[key]
              console.log(image.url);
            }*/
            $("#results-suggested").append("<div id='playlist-div' style='background-image: url("+sgPlaylist.images[0].url+");'><a href='#/playlist/"+sgPlaylist.id+"/"+sgPlaylist.owner.id+"'><span id='playlist-div-span'>"+sgPlaylist.name+"</span></a></div>");
          }

          return result.items;
        }
      });
  }

    //get playlist from an array with id's created in the search-ctrl
    //the id's are taken from the database, this in order to display
    //the users OWN playlists that he has tagged with the relevant mood/genre/keywords
    this.getPlaylist = function(idArray,genre) {
    //console.log(idArray);
    $("#results").html("<h3>Your playlists tagged as "+genre+":</h3>");
    for (key in playlists){
       var playlist = playlists[key];
       if(jQuery.inArray(playlist.id, idArray) !== -1)
           /* for (key in playlist.images){
              var image = playlist.images[key]
              console.log(image.url);
            }*/
            $("#results").append("<div id='playlist-div' style='background-image: url("+playlist.images[0].url+");'><a href='#/playlist/"+playlist.id+"/"+playlist.owner.id+"'><span id='playlist-div-span'>"+playlist.name+"</span></a></div>");
          }
  }

      //gets user info of the current user
      this.getUserData = function(){
        $http({
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
        return name;
        }, function errorCallback(response) {
        // called asynchronously if an error occurs
        // or server returns response with an error status.
        });
              }


    //get all tracks within a certain playlist
   this.getPlaylistTracks = function(playlistid){
      return $http({
      method: 'GET',
      url: 'https://api.spotify.com/v1/users/ledzappa/playlists/'+playlistid+'/tracks',
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




  // TODO in Lab 5: Add your model code from previous labs
  // feel free to remove above example code
  // you will need to modify the model (getDish and getAllDishes) 
  // a bit to take the advantage of Angular resource service
  // check lab 5 instructions for details





  // Angular service needs to return an object that has all the
  // methods created in it. You can consider that this is instead
  // of calling var model = new DinnerModel() we did in the previous labs
  // This is because Angular takes care of creating it when needed.
  return this;

});