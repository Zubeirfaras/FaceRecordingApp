<?php
// Enable error reporting for debugging
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Check if the video file was uploaded
if(isset($_FILES['video']) && $_FILES['video']['error'] == 0) {
    // Define the upload folder
    $uploadDir = 'upload/';
    
    // Get the file details
    $fileTmpPath = $_FILES['video']['tmp_name'];
    $fileName = $_FILES['video']['name'];
    $fileSize = $_FILES['video']['size'];
    $fileType = $_FILES['video']['type'];
    
    // Generate a unique name for the uploaded file to avoid collisions
    $newFileName = time() . '-' . basename($fileName);
    
    // Define the path to save the file
    $uploadFilePath = $uploadDir . $newFileName;

    // Check if the 'upload' folder exists, if not, create it
    if (!is_dir($uploadDir)) {
        mkdir($uploadDir, 0777, true);
    }

    // Move the uploaded file to the desired location
    if(move_uploaded_file($fileTmpPath, $uploadFilePath)) {
        echo json_encode([
            'message' => 'File uploaded successfully',
            'file' => $uploadFilePath
        ]);
    } else {
        echo json_encode([
            'message' => 'Error uploading the file.',
            'error' => $_FILES['video']['error']
        ]);
    }
} else {
    echo json_encode([
        'message' => 'No file uploaded or there was an error uploading.',
        'error' => $_FILES['video']['error']
    ]);
}
?>
