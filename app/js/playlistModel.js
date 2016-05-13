playlistApp.factory('Playlist',function ($cookieStore,$resource,$http) {

  var accessToken = "";
  var userName = "";
  var playlists = [];


  

  //searches for "global"-playlists that we can suggest to the user
  //the queryparameter holds the selected mood and genre "energetic rock" for example
  this.searchPlaylists = function(query) {
    console.log("search playlisssttssss"+query)
    return $http({
      url: 'https://api.spotify.com/v1/search?q='+query+'&type=playlist&market=SE',
      headers: {
       'Authorization': 'Bearer ' + this.getAccessToken()
       },
      dataType: 'json'
    }).then(function successCallback(response){
        var result = response.data;
        var sgPlaylists = result.playlists.items;
        
        return sgPlaylists;
    });
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
      return result;
    },function errorCallback(response){
      console.log("An error occured");
    });
  }

  //get playlist from an array with id's created in the search-ctrl
    //the id's are taken from the database, this in order to display
    //the users OWN playlists that he has tagged with the relevant mood/genre/keywords
  this.getPlaylist = function(idArray) {
    console.log("getPLaylist: "+playlists);
    var array=[];
    for (var i = 0;i< idArray.length; i++) {
      
      for(key in playlists){
        var playlist=playlists[key];
        
        if(playlist.id==idArray[i].id){
           array.push(playlist);
        }
      }
    }
    return array
  }
//returen all the playlists array
  this.getUserPlaylists = function(){
    var userId=this.getUserId();
    var accesstoken=this.getAccessToken();
        console.log("laiguozheli");
    return $http({
      method: 'GET',
      url: 'https://api.spotify.com/v1/users/'+userId+'/playlists?limit=50',
      headers: {'Authorization': 'Bearer ' + accesstoken}
    }).then(function successCallback(response) {
      
      var data = response.data;
      return data.items;
      }, function errorCallback(response) {
          console.log("gick åt hvete");
      });
  }

  this.getAllPlaylists=function(){
    
      return playlists;
    
    
  }

  this.searchKeywords= function(query){
      var userId=this.getUserId();
      return $http({
        method: 'POST',
        url: 'getplaylistfromkeywords.php',
        data: {Keyword:query, UserId:userId}
      }).then(function SuccessCallback(response){
        var data = response.data;
        return data;
      },function errorCallback(response){
        console.log("An error occurred");
      })
  }
  this.getAllEdits=function(){
    var userId=this.getUserId();
    return $http({
      method: 'POST',
      url: 'getplaylist.php',
      data: {UserId:userId}
    }).then(function SuccessCallback(response){
      var result = response.data;
        var array = [];
        for(key in result){
          array.push(result[key].id);
        }
        return array
    });
  }
  

this.checkIfFollowed = function(playlistid,ownerId){
    return $http({
        url: 'https://api.spotify.com/v1/users/'+ownerId+'/playlists/'+playlistid+'/followers/contains?ids='+this.getUserId(),
        method: 'GET',
        headers: {'Authorization': 'Bearer ' + this.getAccessToken()}
      }).then(function successCallback(response){
          var result = response.data;
          console.log(response.data);
          return result;
        }, function errorCallback(response) {
          console.log("gick åt hvete");
        });

  }

    this.followPlaylist = function(playlistid,ownerId){
    return $http({
      url: 'https://api.spotify.com/v1/users/'+ownerId+'/playlists/'+playlistid+'/followers',
      method: 'PUT',
      headers: {'Authorization': 'Bearer ' + this.getAccessToken()}
    }).then(function SuccessCallback(response){
      var result = response.data;
      console.log(response.data);
      return result;
      }, function errorCallback(response){
          console.log("ERROR! editplaylistctrl>followplaylist");
      });
  }

  //UNFOLLOWS A PLAYLIST
  this.unfollowPlaylist = function(playlistid,ownerId){
    return $http({
      url: 'https://api.spotify.com/v1/users/'+ownerId+'/playlists/'+playlistid+'/followers',
      method: 'DELETE',
      headers: {'Authorization': 'Bearer ' + this.getAccessToken()}
    }).then(function SuccessCallback(response){
      var result = response.data;
      console.log(response.data);
      return result;
    }, function errorCallback(response){
          console.log("An error occured");
      });
  }



  //get user's labels
  this.getUserLabels=function(userId,labeltype){
    return $http({
      method: 'POST',
      url: 'getlabels.php',
      data: {UserId:userId, LabelType: labeltype}
    }).then(function SuccessCallback(response){
        var result = response.data;
        return result;
    });

  }
  this.getMeta = function(id,userid){
    return $http({
      method: 'POST',
      url: 'getplaylist.php',
      data: {Id:id, UserId:userid}
    }).then(function SuccessCallback(response){
        var result = response.data;
        return result;
    });
  }
  this.insert = function(id,mood,genre,keywords){
    var userId=this.getUserId();
    return $http({
      method: 'POST',
      url: 'insert.php',
      data: {Id:id, Mood:mood, Genre:genre, Keywords:keywords, UserId:userId}
    }).then(function SuccessCallback(response){
        var result = response.data;
        return result;
    });
  }


  this.removeLabel= function(labelType,removeLabel){
    var userId=this.getUserId();
    return $http({
      method: 'POST',
      url: 'removeLabel.php',
      data: {UserId:userId, LabelType: labelType, RemoveLabel: removeLabel}
    }).then(function SuccessCallback(response){
      var result = response.data;
      return result;
    });
  }

  this.addLabel= function(labelType,newLabel){
    var userId = this.getUserId();
    return $http({
      method: 'POST',
      url: 'addLabel.php',
      data: {UserId:userId, LabelType: labelType, NewLabel: newLabel}
    }).then(function SuccessCallback(response){
      var result = response.data;
      return result;
    });
  }
  

    return this;

});