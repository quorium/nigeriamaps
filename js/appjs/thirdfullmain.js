var map, markerFeatureGroup, tempLayer, tempCLusterLayer, stateCustomList, stateIncidentList, ssearchWidget;
var configData = [];
var allIncidentTrendChart;
var radSelVal = "";
var sideSearchVisible = false;
var searchRangeOptDiv = "searchRange";
var range_3d = "3d";
var range_1w = "1w";
var range_1m = "1m";
var range_3m = "3m";
var range_6m = "6m";
var sort_DaAs = "sort_DaAs";
var sort_DaDes = "sort_DaDes";
var sort_InciTypeAs = "sort_InciTypeAs";
var sort_InciTypeDes = "sort_InciTypeDes";
var eventdateKey = "Event_Date";
var lga_key = "LGA";
var colorKey = "Color";

var osmUrl = 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
var osmAttrib = '&copy; <a href="http://openstreetmap.org/copyright">OpenStreetMap</a> contributors';
var osm = L.tileLayer(osmUrl, {maxZoom: 18, attribution: osmAttrib});
var map = new L.Map('map', {center: new L.LatLng(8.0, 8.0), zoom: 6});
var drawnItems = L.featureGroup().addTo(map);
markerFeatureGroup = L.featureGroup().addTo(map);
tempLayer = L.featureGroup().addTo(map);
tempCLusterLayer = L.featureGroup().addTo(map);
osm.addTo(map);

var myCustomColour = '#583470';

var markerHtmlStyles = `
  background-color: ${myCustomColour};
  width: 3rem;
  height: 3rem;
  display: block;
  left: -1.5rem;
  top: -1.5rem;
  position: relative;
  border-radius: 3rem 3rem 0;
  transform: rotate(45deg);
  border: 1px solid #FFFFFF`;

var icon = L.divIcon({
    className: "my-custom-pin",
    iconAnchor: [0, 24],
    labelAnchor: [-6, 0],
    popupAnchor: [0, -36],
    html: `<span style="${markerHtmlStyles}" />`
});


$(document).ready(function () {
    
     var selectHandler = function(e, tab) {
        if (tab.newTab.index() == 2){
            window.location = "//www.nigeriariskindex.com/register/?map";
        }
        
      },
      tabOptions = {
        beforeActivate: selectHandler
      }
      
$("#tabs").tabs(tabOptions);



    $("#sideButton").click(function () {
        toggleSideSearch();
    });






    $("#sideButton").click();
    statePinModule();



//    $('#example').DataTable({
//        dom: 'Bfrtip',
//        buttons: [
//            'print'
//        ]
//    });


    $("#viewAllStates").click(function () {
        statePinModule();
        map.closePopup();

        stateCustomList.selected = null;
        $("#tabs").tabs("option", "active", 1);
        $("#" + this._containerId).empty();
        updateSelectedState();
        statePinModule();



    });
    var greenIcon = new L.Icon({
        iconUrl: 'libs/leafletColorMarker/img/marker-icon-2x-green.png',
        shadowUrl: 'libs/leafletColorMarker/img/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
    });


});



function statePinModule() {
    //On the Map you will indicate each of the 36 States in Nigeria with a Pin on their State Capitals. 
    //The pin will indicate the number of incidents in each State.
    //On click the map zooms to that State and the pin opens up with smaller pins showing the incidents in the state.
    //
    $.ajax({
        url: "php/getNigerStates.php",
        success: function (result) {

            var res = JSON.parse(result);
            if (res.length == 0) {

                return;
            }
            tempCLusterLayer.clearLayers();
            tempLayer.clearLayers();
            $("#tabs").tabs("option", "active", 0);

            stateCustomList = new StateCustomList('stateListArr');
            var items = [];

            for (var i = 0; i < res.length; i++) {

                r = res[i].geom;
                LL = omnivore.wkt.parse(r);
                LL.eachLayer(function (feature, layer) {
                    feature.feature.properties = res[i].properties;
                    feature.feature.polyGeom = omnivore.wkt.parse(res[i].polygonGeom);
                });
                markerFeatureGroup.addLayer(LL);
                LL.on('click', function (evt, e) {
                    stateCustomList.selected = evt.target.stateItem;
                    var feature = evt.target.toGeoJSON().features[0];
                    $("#tabs").tabs("option", "active", 1);
                    updateSelectedState();

//                    $("#inci_" + feature.properties["admin"]).click();
                    tempLayer.clearLayers();
                    tempLayer.addLayer(feature.polyGeom);
                    map.flyToBounds(feature.polyGeom.getBounds());
//                    map.fitBounds(feature.polyGeom.getBounds());
                    highlightFeature(feature.polyGeom);
                    var popupContent = '<table >';
                    for (key in feature.properties) {
                        popupContent += "<tr><td> " + feature.properties[key] + "</td></tr>";
                    }
                    popupContent += '</table>'
                    evt.target.bindPopup(popupContent).openPopup();
                    stateEventsPinModule(feature.properties["admin"]);
                });
                var s = new StateCustomListItem(LL.toGeoJSON().features[0].properties["admin"], LL)
                stateCustomList.addItem(s);
                LL.stateItem = s;
                items.push(LL);

                map.flyToBounds(markerFeatureGroup.getBounds());

            }
            if (ssearchWidget != undefined) {
                ssearchWidget.remove();

            }
            ssearchWidget = L.control.search({
                data: items
            }).addTo(map);

            //After this search add, add search range options ui
            addSearchRangeUi();
            updateSelectedState();
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {

        }
    });
}


function stateEventsPinModule(stateName) {
    //It will contain stateName as an argument and it will fetch event details against each location
    var dObj = getSearchDateParams();

    $.ajax({
        url: "php/getNigerStateEvent.php?state=" + stateName + "&fromDate=" + dObj.fromDate + "&toDate=" + dObj.toDate,
        success: function (result) {
            var res = JSON.parse(result);

            tempCLusterLayer.clearLayers();
            markerFeatureGroup.clearLayers();
            stateIncidentList = new StateIncidentList('stateIncidentListArr');
            var items = [];

            stateIncidentList.clearAll();
            for (var i = 0; i < res.length; i++) {


                r = res[i].geom;
                LL = omnivore.wkt.parse(r);
                LL.eachLayer(function (feature, layer) {
                    feature.feature.properties = res[i].properties;
                });
                tempCLusterLayer.addLayer(LL);


                LL.on('click', function (evt, e) {
                    stateIncidentList.selectedIncident = evt.target.stateIncidentItem;
                    stateIncidentList.filter(stateIncidentList.selectedIncident.properties[lga_key]);
                    updateSelectedIncident();
                    var feature = evt.target.toGeoJSON().features[0];
                    $("#tabs").tabs("option", "active", 1);
        
                    var popupContent = '<table >';
                    for (key in evt.layer.feature.properties) {
                        var k = key.replace("_", " ");
                        if (k != colorKey){
                            popupContent += "<tr><td> <b>" + k + ":</b> </td><td> " + evt.layer.feature.properties[key] + "</td></tr>";
                        }
                        
                    }
                    popupContent += "<tr><td> <b>Total Incidents: </b> </td><td> " + stateIncidentList.getLgaIncidentCount(stateIncidentList.selectedIncident.properties[lga_key])  + "</td></tr>";
                    
                    popupContent += '</table>'
                    evt.layer.bindPopup(popupContent).openPopup();
                    
                    
                });

                var s = new StateIncidentListItem(res[i].properties["Risk_Factors"], res[i].properties);
                stateIncidentList.addItem(s);
                LL.stateIncidentItem = s;
                items.push(LL);
                myCustomColour = res[i].properties[colorKey];

                var markerHtmlStyles = `
                    background-color: ${myCustomColour};
                    width: 3rem;
                    height: 3rem;
                    display: block;
                    left: -1.5rem;
                    top: -1.5rem;
                    position: relative;
                    border-radius: 3rem 3rem 0;
                    transform: rotate(45deg);
                    border: 1px solid #FFFFFF`;
                icon = L.divIcon({
                    className: "my-custom-pin",
                    iconAnchor: [0, 24],
                    labelAnchor: [-6, 0],
                    popupAnchor: [0, -36],
                    html: `<span style="${markerHtmlStyles}" />`
                })
                LL.getLayers()[0].setIcon(icon);
            }
            if (ssearchWidget != undefined) {
                ssearchWidget.remove();
            }
            ssearchWidget = L.control.search({
                data: items
            }).addTo(map);

            //After this search add, add search range options ui
            //addSearchRangeUi();
//After this search add, add search range options ui

            addSearchRangeUi();
            updateSelectedState();


            //drawAllGraphs();
            $("#sortSel").trigger('change');
            var sortedArr = customBubbleSort(stateIncidentList.stateIncidentList);
            if (sortedArr.length > 0) {
                var temp = 0;
                for (var i = (sortedArr.length - 1); i > 0; i--) {
                    temp++;
                    if (temp > 3) {
                        break;
                    }
                    $("#count_inci_" + temp).text(sortedArr[i].Lenn);
                    $("#inci_" + temp).text(sortedArr[i].name);


//                    new Chart(document.getElementById("line-chart-" + temp), {
//                        type: 'line',
//                        data: {
//                            labels: [15, 16, 17, 18, 19, 20],
//                            datasets: [{
//                                    data: [2, 13, 14, 15, 16, 18, 19, 14, 37, 25],
//                                    label: "Asia",
//                                    borderColor: "#8e5ea2",
//                                    fill: true
//                                }
//                            ]
//                        },
//                        options: {
//                            title: {
//                                display: true,
//                                text: sortedArr[i].name
//                            }, legend: {
//                                display: false
//                            },
//                            tooltips: {
//                                enabled: true
//                            }
//                        }
//                    });
                }
            }

        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {

        }
    });
}
