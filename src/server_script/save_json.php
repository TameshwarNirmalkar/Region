<?php

	$json = $_POST['objects'];
	
	$file = fopen('general.json','w+');
	fwrite($file, $json);
	fclose($file);
   
?>