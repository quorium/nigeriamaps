<?php

require_once("db-settings.php"); //Require DB connection
$myArr = array();
global $mysqli, $db_table_prefix;

$queryy = "";
//$queryy = "select admin,admin1refn,admin0name,capital,region,slogan,zipcode,population,type,country,political,humantraf,religious,civilunre,manmaded,terrorism,tr_robbery,drugtraff,kidnapping,homicide,tr_epidemi,humanrigh,threatind,threatrat,threatlev, ST_AsWKT(SHAPE) as geom from nigeriamapsthreats where ST_Intersects(SHAPE, ST_GeomFromText('POLYGON(".$geomString.")',4326))";
//$queryy = "select admin,ST_AsWKT(SHAPE) as polygonGeom, ST_AsWKT(ST_Centroid(SHAPE)) as poiGeom from nigeriamapsthreats";
$queryy = "select admin,ST_AsWKT(SHAPE) as polygonGeom, ST_AsWKT(ST_Centroid(SHAPE)) as poiGeom from nigeriamapsthreats";

$stmt = $mysqli->prepare($queryy);
$stmt->execute();
//$stmt->bind_result($admin, $admin1refn, $admin0name, $capital, $region, $slogan, $zipcode, $population, $type, $country, $political, $humantraf, $religious, $civilunre, $manmaded, $terrorism, $tr_robbery, $drugtraff, $kidnapping, $homicide, $tr_epidemi, $humanrigh, $threatind, $threatrat, $threatlev, $geom);
$stmt->bind_result($admin,$polygonGeom, $poiGeom);
//echo $queryy;
while ($stmt->fetch()){
	$myObj = new \stdClass();
	$row = array();
	//$row = array('admin' => $admin, 'admin1refn' => $admin1refn, 'admin0name' => $admin0name, 'capital' => $capital, 'region' => $region, 'slogan' => $slogan, 'zipcode' => $zipcode, 'population' => $population, 'type' => $type, 'country' => $country, 'political' => $political, 'humantraf' => $humantraf, 'religious' => $religious, 'civilunre' => $civilunre, 'manmaded' => $manmaded, 'terrorism' => $terrorism, 'tr_robbery' => $tr_robbery, 'drugtraff' => $drugtraff, 'kidnapping' => $kidnapping, 'homicide' => $homicide, 'tr_epidemi' => $tr_epidemi, 'humanrigh' => $humanrigh, 'threatind' => $threatind, 'threatrat' => $threatrat, 'threatlev' => $threatlev, 'geom' => $geom);
	$myObj->admin  = $admin;
			

	$myObj->Event_Date  = $edd;


	$row = array('properties' => $myObj, 'geom' => $poiGeom, 'polygonGeom' => $polygonGeom);

	array_push($myArr, $row );
}
$stmt->close();
echo json_encode($myArr);

?>