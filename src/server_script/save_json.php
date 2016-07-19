<?php

	// $jsondata = $_POST['objects'];
	// echo file_get_contents('php://input');
	// $file = fopen('general.json','w+');
	// fwrite($file, $json);
	// fclose($file);
	$ext = '.json';
	$json = file_get_contents("php://input");
	$obj = json_decode($json);
	$getfilename = $obj->{'filename'};
	$createfile = $getfilename+$ext;
	//echo "$getfilename";
	$file = fopen("../stored_files/". $getfilename ."-regions.json","w") or die("can't open file");
	fwrite($file, $json);
	fclose($file);
	$sucessObject = '{"status": "200", "message":"Sucessfull Saved"}';
	echo $getfilename;
?>