<?php

	$jsondata = $_POST['objects'];
	echo file_get_contents('php://input');
	// $file = fopen('general.json','w+');
	// fwrite($file, $json);
	// fclose($file);
   
	$json = file_get_contents("php://input");
	$file = fopen('general.json','w+');
	fwrite($file, $json);
	fclose($file);
?>