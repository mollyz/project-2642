<?php
$username = "root";
$password = "";
$servername = "localhost";
$databasename = 'playlist';
//$info = '000003 03030303 030303030 030303030 030303030';
//$info = $_POST['Result'];
//$name = $_POST['Name'];
//$antalkassa = $_POST['Antalkassa'];

$id = $_POST['Id'];
$mood = $_POST['Mood'];
$genre = $_POST['Genre'];
$keywords = $_POST['Keywords'];


// Create connection
$conn = new mysqli($servername, $username, $password, $databasename);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
} 

$sql = "INSERT INTO playlist (id, mood, genre, keywords)
VALUES ('$id', '$mood', '$genre', '$keywords')";

echo $sql;

if (mysqli_query($conn, $sql)) {
    echo "New record created successfully";
} else {
    echo "Error: " . $sql . "<br>" . mysqli_error($conn);
}
?>