playlistApp.factory('Playlist',function ($cookieStore,$resource,$http) {

  var accessToken = "";
  var userName = "";
  //var dishes = [];

  this.getUserPlaylists = function(accessToken) {
    $.ajax({
      url: 'https://api.spotify.com/v1/users/ledzappa/playlists?limit=50',
      headers: {
       'Authorization': 'Bearer ' + accessToken

     },
     dataType: 'json',
     success: function(result){
      $("#results").html("");

      var result = result.items;
      for (key in result){
       var playlist = result[key];
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

  /*this.getPlaylistTracks = function(playlistid) {
    $.ajax({
      url: 'https://api.spotify.com/v1/users/ledzappa/playlists/'+playlistid+'/tracks',
      headers: {
       'Authorization': 'Bearer ' + this.getAccessToken()

     },
     dataType: 'json',
     success: function(result){

      var result = result.items;
      var name = result["1"].track.name;
      console.log(name);
      return name;
    }
    
  });
  }
  */
	/*this.getUserData = function(accessToken) {
        $.ajax({
            url: 'https://api.spotify.com/v1/me',
            headers: {
               'Authorization': 'Bearer ' + accessToken               
            },
            dataType: 'json',
            success: function(result){
      console.log("Playlists:"+ result);
    }
        });
      }*/

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
userName = name;
console.log(data.display_name);
$cookieStore.put("userid", data.id);
return name;
}, function errorCallback(response) {
// called asynchronously if an error occurs
// or server returns response with an error status.
});
      }

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
  return $cookieStore.get("userid");
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