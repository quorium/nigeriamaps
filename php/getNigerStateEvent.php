<?php

require_once("db-settings.php"); //Require DB connection
$myArr = array();
global $mysqli, $db_table_prefix;

if ((!empty($_GET["state"]))) {
    $stateLocation = $_GET["state"];
    $fromDate = null;
    $toDate = null;
    if ((!empty($_GET["fromDate"]))) {
        $fromDate = $_GET["fromDate"];
    }
    if ((!empty($_GET["toDate"]))) {
        $toDate = $_GET["toDate"];
    }
    $queryy = "";
//DATE_FORMAT(tde.eventdate, '%b %D, %Y')
    if ($fromDate == null and $toDate == null) {
        $queryy = "SELECT tga.LGA, tga.State, tga.latitude, tga.longitude, tde.riskfactors,tde.riskindicators, trf.Color,tde.eventdate, tde.impact  from tbldataentry tde
inner join tbllga tga
on tga.LGA = tde.lga
and tde.location =  '$stateLocation'
inner join tblriskfactors trf
on tde.riskfactors = trf.NAME order by tde.eventdate";
    } else {
        $queryy = "SELECT tga.LGA, tga.State, tga.latitude, tga.longitude, tde.riskfactors,tde.riskindicators, trf.Color, tde.eventdate, tde.impact  from tbldataentry tde
inner join tbllga tga
on tga.LGA = tde.lga
and tde.location =  '$stateLocation'
inner join tblriskfactors trf
on tde.riskfactors = trf.NAME 
and (
    tde.eventdate > '$fromDate'
    and
    tde.eventdate < '$toDate') order by tde.eventdate";
    }


    $stmt = $mysqli->prepare($queryy);
    $stmt->execute();
    $stmt->bind_result($LGA, $State, $latitude, $longitude, $riskfactors,$riskindicators, $Color, $eventdate, $impact);
    while ($stmt->fetch()) {
        $myObj = new \stdClass();
        $row = array();
//$row = array('admin' => $admin, 'admin1refn' => $admin1refn, 'admin0name' => $admin0name, 'capital' => $capital, 'region' => $region, 'slogan' => $slogan, 'zipcode' => $zipcode, 'population' => $population, 'type' => $type, 'country' => $country, 'political' => $political, 'humantraf' => $humantraf, 'religious' => $religious, 'civilunre' => $civilunre, 'manmaded' => $manmaded, 'terrorism' => $terrorism, 'tr_robbery' => $tr_robbery, 'drugtraff' => $drugtraff, 'kidnapping' => $kidnapping, 'homicide' => $homicide, 'tr_epidemi' => $tr_epidemi, 'humanrigh' => $humanrigh, 'threatind' => $threatind, 'threatrat' => $threatrat, 'threatlev' => $threatlev, 'geom' => $geom);
        $myObj->State = $State;
        $myObj->LGA = $LGA;
        $myObj->Risk_Factors = $riskfactors;
        $myObj->Risk_Indicators = $riskindicators;
        $myObj->Color = $Color;        
        
        $myObj->Event_Date = $eventdate;
        $myObj->Impact = $impact;

        $poiGeom = "POINT($longitude $latitude)";

        $row = array('properties' => $myObj, 'geom' => $poiGeom);

        array_push($myArr, $row);
    }
    $stmt->close();
    echo json_encode($myArr);
} else {
    echo "data receiving failed";
}
?>