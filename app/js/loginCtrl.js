playlistApp.controller('LoginCtrl', function ($scope,Playlist) {

  // TODO in Lab 5: you will need to implement a method that searchers for dishes
  // including the case while the search is still running.
  $scope.login = function (){
  	var client_id = "7c6e405a8e084d6488c5bb0e892c52ba";
  	var scope = 'user-read-private user-read-email playlist-read-private';
    //var redirect_uri = 'http%3A%2F%2Fwww.aftonbladet.se';
  	var redirect_uri = 'http%3A%2F%2Flocalhost%3A8888%2Fproject%2Fapp%2Findex.html%23%2Fcallback';

  	var querystring = "client_id="+client_id+"&response_type=code&redirect_uri="+redirect_uri+"&scope="+scope;
  	console.log("QUERY: " +querystring);
    window.location.href='https://accounts.spotify.com/authorize?' + querystring;

    //var foo = Playlist.getQueryString('token');
  	//res.redirect('https://accounts.spotify.com/authorize?' + querystring);

  }

});