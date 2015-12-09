<?php
function isIndex($page) {
  return in_array($page, ["", "index.php"]);
}

function cleanCache($time) {
  $files = glob(__DIR__ . "/../cache/*");
  $now = time();

  foreach($files as $file) {
    if (is_file($file) && ($now - filemtime($file)) >= $time) {
      unlink($file);
    }
  }
}


cleanCache(180);

$config = parse_ini_file("../config.ini");

$page = explode("/", $_SERVER["REQUEST_URI"]);
$page = $page[count($page)-1];

$rootPath = (isIndex($page) ? "." : "..");
$rootPage = $_SERVER["SCRIPT_NAME"];
$rootUrl =  $config["site_url"] . str_replace("index.php", "", $rootPage);

$page = (isIndex($page) ? "about" : $page);
$page = (!file_exists("templates/{$page}.html") ? "404" : $page);

$menuItems = ["about", "how to use", "pricing"];

$context = stream_context_create(array('http' => array('header'  => "Authorization: Bearer " . $config["api_key"])));
$userData = json_decode(file_get_contents($config["api"] . "/users/" . $config["api_email"], false, $context), true);

$accessToken = $userData["access_token"];

require_once("templates/header.php");
require_once("templates/{$page}.html");
require_once("templates/footer.php");
?>
