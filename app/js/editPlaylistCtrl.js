playlistApp.controller('EditPlaylistCtrl', function ($scope) {

  // TODO in Lab 5: you will need to implement a method that searchers for dishes
  // including the case while the search is still running.


  $scope.insert = function(id,mood,genre,keywords){
  	console.log("insert");
  	$.ajax({
		type: 'POST',
		url: 'insert.php',
		data: {Id:id, Mood:mood, Genre:genre, Keywords:keywords},
		success: function(result){
			alert("saved!");
		},
		error: function(){
			alert('error saving order');
		}

	});

  }

});