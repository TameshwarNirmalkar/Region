<?php
	$ext 				= ".json";
	$json 				= file_get_contents("php://input");
	$obj 				= json_decode($json);
	$getfilename 		= $obj->{"filename"};
	$createfilename 	= $getfilename.$ext;
	$sucessObject 		= '{"status": "200", "message":"Sucessfull Saved."}';
	$file 				= fopen("../stored_files/". $createfilename ,"w+") or die("can't open file");
	fwrite($file, $json);
	fclose($file);
	echo $sucessObject;
?>