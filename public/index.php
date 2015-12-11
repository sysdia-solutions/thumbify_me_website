<?php
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
$page = ($page === "" ? "about" : $page);
$page = (!file_exists("templates/{$page}.html") ? "404" : $page);

$menuItems = ["about", "how to use", "pricing"];

require_once("templates/header.php");
require_once("templates/{$page}.html");
require_once("templates/footer.php");
?>
