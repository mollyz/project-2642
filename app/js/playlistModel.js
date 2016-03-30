playlistApp.factory('Playlist',function ($cookieStore,$resource) {
  
  var accessToken = "";
  //var dishes = [];

  	
  //this.PlaylistSearch = $resource('https://api.spotify.com/v1/users/ledzappa/playlists');

	this.getUserPlaylists = function(accessToken) {
        $.ajax({
            url: 'https://api.spotify.com/v1/users/ledzappa/playlists',
            headers: {
               'Authorization': 'Bearer ' + accessToken

            },
            dataType: 'json',
            success: function(result){
            $("#results").html("");

      		var result = result.items;
      		for (key in result){
		    	var playlist = result[key];
		    	$("#results").append("<div id='playlist-div'><div id='playlist-div-1'></div><div id='playlist-div-2'></div><div id='playlist-div-3'></div><div id='playlist-div-4'></div><p>Name:"+playlist.name+"</p><p>ID: "+playlist.id+"</p></div>");
		      	}

      		return result.items;
    }
        });
    }

	this.getUserData = function(accessToken) {
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