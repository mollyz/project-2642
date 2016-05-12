<?php
include 'db-login.php';

$postdata = file_get_contents("php://input");
$request = json_decode($postdata);
$userid = $request->UserId;
$label = $request->LabelType;

// Create connection
$conn = new mysqli($servername, $username, $password, $databasename);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
} 

if($label == "mood"){
$sql = "SELECT * FROM pl_".$userid."_moodlabels";

$result = $conn->query($sql);

	if ($result->num_rows > 0) {
		$array = array();
	    while($row = $result->fetch_assoc()) {
	    	$array[] = $row;
	    }
	    echo json_encode($array);
	} else {
	    echo "0 results";
	}
} else if ($label == "genre"){
$sql = "SELECT * FROM pl_".$userid."_genrelabels";

$result = $conn->query($sql);

	if ($result->num_rows > 0) {
		$array = array();
	    while($row = $result->fetch_assoc()) {
	    	$array[] = $row;
	    }
	    echo json_encode($array);
	} else {
	    echo "0 results";
	}


}

?>