<?php
	$ext 			= ".json";
	// $json			= file_get_contents("php://input");
	// $obj 			= json_decode($json);
	// $getfilename 	= $obj->{"filename"};
	// $createfilename = $getfilename.$ext;
	// $filecontents 	= file_get_contents("./stored_files/2-regions.json");
	// $readfile		= json_decode( $filecontents );
	$json 			= file_get_contents('../stored_files/2-regions.json');
	//Decode JSON
	$json_data = json_decode($json,true);

	echo $json_data->objects;
?>