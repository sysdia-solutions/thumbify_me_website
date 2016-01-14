<h1>Debug Callback Results</h1>
<?php
$lines = explode("****\n", file_get_contents(__DIR__."/debug_callback_results.txt"));
if (isset($lines[3])) {
  echo "<img src='data:image/jpeg;base64," .$lines[3] . "'>";
} else {
  echo "<p>something went wrong</p>";
}
?>
