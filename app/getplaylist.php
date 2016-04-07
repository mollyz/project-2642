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

//$sql = 'SELECT mood,genre,keywords WHERE id="$id"';
$sql = "SELECT * FROM playlist WHERE id='$id'";
$result = $conn->query($sql);

if ($result->num_rows > 0) {
    // output data of each row
    while($row = $result->fetch_assoc()) {
    	//header('Content-Type: application/json');
    	echo json_encode($row);
        //echo "id: " . $row["id"]. " - mood: " . $row["mood"]. " " . $row["genre"]. "<br>";
    }
} else {
    echo "0 results";
}

?>