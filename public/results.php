<?php
$responseId = $_GET["response_id"];

$file = __DIR__ . "/../cache/{$responseId}";

$results = array("status" => "pending", "payload" => "");

if (file_exists($file)) {
  $results = json_decode(file_get_contents($file), true);
  unlink($file);
}

header('Content-Type: application/json');
echo json_encode($results);
