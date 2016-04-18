<?php
$username = "root";
$password = "root";
$servername = "localhost";
$databasename = 'playlist';
//$info = '000003 03030303 030303030 030303030 030303030';
//$info = $_POST['Result'];
//$name = $_POST['Name'];
//$antalkassa = $_POST['Antalkassa'];

$id = $_POST['Id'];

// Create connection
$conn = new mysqli($servername, $username, $password, $databasename);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
} 

if ($id){
	//RETURNS THE ROW FOR A SPECIFIC ID
	$sql = "SELECT * FROM playlist WHERE id='$id'";
	$result = $conn->query($sql);
	if ($result->num_rows > 0) {
	    while($row = $result->fetch_assoc()) {
	    	echo json_encode($row);}
	} else {
	    echo "0 results";}

} else {
	//RETURNS ALL THE ID's IN THE DB
	$sql = "SELECT id FROM playlist";
	$result = $conn->query($sql);
	$array = array();
	if ($result->num_rows > 0) {
	    while($row = $result->fetch_assoc()) {
	    	$array[] = $row;}
	echo json_encode($array);
	} else {
	    echo "0 results";
	}
}


?>