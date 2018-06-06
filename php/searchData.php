<?php

require_once("db-settings.php"); //Require DB connection
$myArr = array();
global $mysqli, $db_table_prefix;
if ((!empty($_GET["term"]))) {
    $searchTerm = $_GET["term"];
    $queryy = "";
    $queryy = "select * from tblweeklydataentry where riskfactor like '%$searchTerm%' or riskindicator like '%$searchTerm%' or  location  like '%$searchTerm%' or lga like '%$searchTerm%' or  caption like '%$searchTerm%'";

    $stmt = $mysqli->prepare($queryy);
    $stmt->execute();

    $stmt->bind_result($admin, $polygonGeom, $poiGeom);
//echo $queryy;
    while ($stmt->fetch()) {
        $myObj = new \stdClass();
        $row = array();
//$row = array('admin' => $admin, 'admin1refn' => $admin1refn, 'admin0name' => $admin0name, 'capital' => $capital, 'region' => $region, 'slogan' => $slogan, 'zipcode' => $zipcode, 'population' => $population, 'type' => $type, 'country' => $country, 'political' => $political, 'humantraf' => $humantraf, 'religious' => $religious, 'civilunre' => $civilunre, 'manmaded' => $manmaded, 'terrorism' => $terrorism, 'tr_robbery' => $tr_robbery, 'drugtraff' => $drugtraff, 'kidnapping' => $kidnapping, 'homicide' => $homicide, 'tr_epidemi' => $tr_epidemi, 'humanrigh' => $humanrigh, 'threatind' => $threatind, 'threatrat' => $threatrat, 'threatlev' => $threatlev, 'geom' => $geom);
        $myObj->admin = $admin;

        $row = array('properties' => $myObj, 'geom' => $poiGeom, 'polygonGeom' => $polygonGeom);

        array_push($myArr, $row);
    }
    $stmt->close();
    echo json_encode($myArr);
} else {
    echo "data receiving failed";
}
?>