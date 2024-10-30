<?php
 $data = json_decode(file_get_contents("php://input"), true);
 $fileData = $data['file'];
 $fileName = $data['fileName'];
 $targetDir = "uploads/";
 $targetFile = $targetDir . basename($fileName);
 // Decode the base64 image
 $imageData = explode(",", $fileData)[1];
 file_put_contents($targetFile, base64_decode($imageData));
 if (file_exists($targetFile)) {
    echo json_encode(["filePath" => $targetFile]);
 } else {
    echo json_encode(["error" => "Failed to upload file"]);
 }
 ?>