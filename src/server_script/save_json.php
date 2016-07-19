<?php

	// $jsondata = $_POST['objects'];
	// echo file_get_contents('php://input');
	// $file = fopen('general.json','w+');
	// fwrite($file, $json);
	// fclose($file);
	$ext = '-regions.json';
	$json = file_get_contents("php://input");
	// echo $json;
	$file = fopen('../stored_files/1-regions.json','w+') or die("can't open file");
	fwrite($file, $json);
	fclose($file);
	$sucessObject = '{"status": "200", "message":"Sucessfull Saved"}';
	echo '{'+$json["filename"]+'}';
?>