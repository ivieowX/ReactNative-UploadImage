<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

$host = 'localhost';
$dbname = '6460704003';
$username = '6460704003';
$password = '6460704003';
$conn = new mysqli($host, $username, $password, $dbname);
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}   // Fetch image paths
$sql = "SELECT img, datetime FROM payment ORDER BY datetime DESC";
$result = $conn->query($sql);
$images = [];
if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $images[] = [
            "img" => $row['img'],
            "datetime" => $row['datetime']
        ];
    }
}
echo json_encode($images);
$conn->close();
