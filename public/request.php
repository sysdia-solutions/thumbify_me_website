<?php
$config = parse_ini_file("../config.ini");

$context = stream_context_create(array('http' => array('header'  => "Authorization: Bearer " . $config["api_key"])));
$userData = json_decode(file_get_contents($config["api"] . "/users/" . $config["api_email"], false, $context), true);
$accessToken = $userData["access_token"];

$data = array(
  "access_token" => $accessToken,
  "media_url"    => $_POST['media_url'],
  "dimensions"   => "500x500",
  "callback_url" => $_POST['callback_url']
);

$curl = curl_init($config["api"] . "/");
curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
curl_setopt($curl, CURLOPT_POST, true);
curl_setopt($curl, CURLOPT_POSTFIELDS, $data);
curl_setopt($curl, CURLOPT_SSL_VERIFYPEER, false);
$result = curl_exec($curl);
$info = curl_getinfo($curl);

if ($result === false) {
  $result = json_endode("An unknown error has occured. Try again!");
}
curl_close($curl);

http_response_code($info["http_code"]);
header('Content-Type: application/json');
die($result);
