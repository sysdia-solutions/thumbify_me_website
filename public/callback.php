<?php
$responseId = $_POST["response_id"];
$results = [ "status"=> $_POST["status"], "payload" => $_POST["payload"] ];

file_put_contents(__DIR__ . "/../cache/{$responseId}", json_encode($results));
