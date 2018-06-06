<?php

//local

//Database Information

$db_host = "localhost"; //Host address (most likely localhost)
$db_name = "nigeriamaps_33"; //Name of Database
$db_user = "root"; //Name of database user
$db_pass = ""; //Password for database user
$db_table_prefix = "";


/*
$db_host = "localhost"; //Host address (most likely localhost)
$db_name = "nigeriar_nigeriamaps_33"; //Name of Database
$db_user = "nigeriar_maps_33"; //Name of database user
$db_pass = "??++Isioma1++??"; //Password for database user
$db_table_prefix = "";
*/
GLOBAL $errors;
GLOBAL $successes;

$errors = array();
$successes = array();

/* Create a new mysqli object with database connection parameters */
$mysqli = new mysqli($db_host, $db_user, $db_pass, $db_name);
GLOBAL $mysqli;

if(mysqli_connect_errno()) {
	echo "Connection Failed: " . mysqli_connect_errno() . $db_host .$db_user .$db_pass .$db_name;
	exit();
}else {
	//echo "yes";
	
}


?>