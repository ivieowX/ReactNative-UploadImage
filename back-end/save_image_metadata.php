<?php
$host = 'localhost';
$dbname = '6460704003';
$username = '6460704003';
$password = '6460704003';
$conn = new mysqli($host, $username, $password, $dbname);
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}
// Retrieve JSON data from POST request
$data = json_decode(file_get_contents("php://input"), true);
$img = $data['img'];
$datetime = $data['datetime'];
// Prepare the SQL statement to insert data into the `payment` table
$sql = "INSERT INTO payment ( img, datetime) VALUES ( ?, ?)";
// Prepare and bind parameters to prevent SQL injection
$stmt = $conn->prepare($sql);
$stmt->bind_param("ss", $img, $datetime);
if ($stmt->execute()) {
    echo json_encode(["status" => "success", "message" => "Data inserted successfully"]);
} else {
    echo json_encode(["status" => "error", "message" => $stmt->error]);
}
// Close the statement and connection
$stmt->close();
$conn->close();
