<?php
$personal_reference = (isset($_POST['personal_reference']) ? $_POST['personal_reference'] : "");

if ( isset($_POST['status']) && isset($_POST['response_id']) && isset($_POST['payload']) ) {
  $vars = array($_POST['status'], $_POST['response_id'], personal_reference, $_POST['payload']);
  file_put_contents(__DIR__."/debug_callback_results.txt", implode("****\n", $vars));
}
?>
