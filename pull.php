<?php
// Log the request payload to a file (optional, for debugging)
file_put_contents('github_payload.log', file_get_contents('php://input'));

// Define the path to your project directory
$project_dir = '~/public_html'; // Set the path to your project

// Define the command to pull the latest code
$command = 'cd ' . $project_dir . ' && git pull 2>&1';

// Execute the pull command and capture the output
$output = shell_exec($command);

// Log the output (optional)
file_put_contents('pull.log', $output . PHP_EOL, FILE_APPEND);

// Respond to GitHub with a success message (optional)
header('Content-Type: application/json');
echo json_encode(['status' => 'success', 'message' => 'Git pull executed.']);
?>
