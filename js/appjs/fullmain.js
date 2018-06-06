var map, drawnItems, clusterFeatureGroup, BoundingBoxArr = [];
var configData = [];

var osmUrl = 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
        osmAttrib = '&copy; <a href="http://openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        osm = L.tileLayer(osmUrl, {maxZoom: 18, attribution: osmAttrib}),
        map = new L.Map('map', {center: new L.LatLng(8.0, 8.0), zoom: 6}),
        drawnItems = L.featureGroup().addTo(map);
clusterFeatureGroup = L.featureGroup().addTo(map);


//Countries.addTo(map);

L.control.layers({
    'osm': osm.addTo(map),
    "google": L.tileLayer('http://www.google.cn/maps/vt?lyrs=s@189&gl=cn&x={x}&y={y}&z={z}', {
        attribution: 'google'
    })
}, {
    'Indicators': clusterFeatureGroup
}, {position: 'topleft', collapsed: false}).addTo(map);



L.Control.IndicatorSelector = L.Control.extend({
    onAdd: function (map) {
        var div = L.DomUtil.create('div', 'info command custome');
        div.id = "smasD";
        div.innerHTML = '<b>Select Indicator</b><hr><select id="filterDropDown"></select>';

        L.DomEvent.disableClickPropagation(div);
        return div;
    },

    onRemove: function (map) {
        // Nothing to do here
    }
});

L.control.indicatorSelector = function (opts) {
    return new L.Control.IndicatorSelector(opts);
}

L.control.indicatorSelector({position: 'topright'}).addTo(map);



var legend = L.control({position: 'bottomright'});
legend.onAdd = function (map) {
    var kkey = $($("#filterDropDown option:selected").get(0)).val();


    var div = L.DomUtil.create('div', 'info legend custome'),
            grades = configData.val[kkey],
            labels = [];

    // loop through our density intervals and generate a label with a colored square for each interval
    div.innerHTML += '<b>' + kkey.toUpperCase() + '</b><hr>'
    for (var i = 0; i < grades.length; i++) {
        div.innerHTML +=
                '<i style="background:' + configData.color[i] + '"></i> ' +
                grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<hr>' : '+');
    }

    return div;
};


var info = L.control({position: 'topleft'});

info.onAdd = function (map) {
    this._div = L.DomUtil.create('div', 'info'); // create a div with a class "info"
    this.update();
    return this._div;
};

// method that we will use to update the control based on feature properties passed
info.update = function (props) {

    var infoContent = '';
    for (key in props) {
        if (configData.popupFields[key]) {
            infoContent += '<b>' + key + '</b> : ' + props[key] + '<br />';
        }
    }

    this._div.innerHTML = infoContent;
};

info.addTo(map);


//map.on('moveend', function (e) {
//    var bounds = map.getBounds();
//
//    var east = bounds.getEast();
//    var north = bounds.getNorth();
//    var south = bounds.getSouth();
//    var west = bounds.getWest();
//    clusterFeatureGroup.clearLayers();
//
//    showLoader(true);
//
//    var urlll = "php/getNigerData.php?east=" + east + "&north=" + north + "&south=" + south + "&west=" + west;
//    fieldss = [];
//    fieldss.push("admin1name");
//    fieldss.push("admin1refn");
//    thematicField = [];
//    thematicField.push("threatlev");
//    smasAddPolygons(urlll, 1, false, fieldss, thematicField);
//
//
//
//});


function clearGridSearch() {
    $("#gridRes").empty();
    graphicFeatureGroup.clearLayers();
}


$(document).ready(function () {

    $.getJSON("js/appjs/configData.json", function (json) {
        configData = json;
        for (k in configData.val) {
            $("<option val = " + k + ">" + k + "</option>").appendTo("#filterDropDown");
        }
        fetchData();//for first time
        legend.addTo(map);
        $('#filterDropDown').change();


        $("#smasD").mouseover(function () {
            map.dragging.disable();
            map.touchZoom.disable();
            map.doubleClickZoom.disable();
            map.scrollWheelZoom.disable();
            map.boxZoom.disable();
            map.keyboard.disable();
            if (map.tap)
                map.tap.disable();
        });
        $("#smasD").mouseout(function () {
            map.dragging.enable();
            map.touchZoom.enable();
            map.doubleClickZoom.enable();
            map.scrollWheelZoom.enable();
            map.boxZoom.enable();
            map.keyboard.enable();
            if (map.tap)
                map.tap.enable();
        });

//        // Disable dragging when user's cursor enters the element
//        legend.getContainer().addEventListener('mouseover', function () {
//            map.dragging.disable();
//        });
//
//        // Re-enable dragging when user's cursor leaves the element
//        legend.getContainer().addEventListener('mouseout', function () {
//            map.dragging.enable();
//        });
    });

    $("#filterDropDown").change(function () {
//        fetchData();
        styler();
        legend.removeFrom(map);
        legend.addTo(map);
    });


//    map.fireEvent('moveend');


});

function showLoader(boolValue) {
//    if (boolValue) {
//        $("#map").css({'opacity': 0.2});
//    } else {
//        $("#map").css({'opacity': 1});
//    }
}

var labelll = [];
function smasAddPolygons(urlll, fieldss) {
    var dd = {};
    $.ajax({
        url: urlll,

        fieldss: fieldss,
        success: function (result) {
            ye = false;
            m100 = false;
            BoundingBoxArr = [];

            if (labelll.length > 0) {
                for (var r = 0; r < labelll.length; r++) {
                    if (map.hasLayer(labelll[r])) {
                        map.removeLayer(labelll[r]);
                    }
                }
                labelll = [];
            }
            //console.log(result);

            var res = JSON.parse(result);
            if (res.length == 0) {

                return;
            }

            for (var i = 0; i < res.length; i++) {
                r = res[i].geom;


                if (r.indexOf("POLYGON") != -1) {
                    LL = omnivore.wkt.parse(r);

                    LL.eachLayer(function (feature, layer) {
                        feature.feature.properties = res[i].roww;
                    });
//                    LL.on('click', function (evt, e) {
//                        var popupContent = '<table >';
//                        for (key in evt.layer.feature.properties) {
//                            if (configData.popupFields[key]) {
//                                popupContent += "<tr><td>" + key + "</td><td> " + evt.layer.feature.properties[key] + "</td></tr>";
//                            }
//                        }
//                        popupContent += '</table>'
//                        evt.layer.bindPopup(popupContent).openPopup();
//                    });
//                    LL.on('mouseover', function (evt) {
//                        var popupContent = '<table >';
//                        for (key in evt.layer.feature.properties) {
//                            if (configData.popupFields[key]) {
//                                popupContent += "<tr><td>" + key + "</td><td> " + evt.layer.feature.properties[key] + "</td></tr>";
//                            }
//                        }
//                        popupContent += '</table>'
//                        evt.layer.bindPopup(popupContent).openPopup();
//                    });
                    LL.on('mouseover', highlightFeature);
                    LL.on('mouseout', resetHighlight);

                    clusterFeatureGroup.addLayer(LL);
                }
                styler();
            }

        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {

        }
    });
}

function styler() {

    var kkey = $($("#filterDropDown option:selected").get(0)).val();
    var smalKey = kkey.toLowerCase();
    clusterFeatureGroup.eachLayer(function (layer) {
        var valo = parseFloat(layer.toGeoJSON().features[0].properties[smalKey]);
        for (var i = 0; i < configData.val[kkey].length; i++) {
            if (valo < configData.val[kkey][i]) {
                layer.setStyle({
                    fillColor: configData.color[i],
                    weight: 2,
                    opacity: 1,
                    color: 'white',
                    dashArray: '2',
                    fillOpacity: 0.7
                });
                break;
            }
        }
    });
}

function fetchData() {
    var bounds = map.getBounds();

    var east = bounds.getEast();
    var north = bounds.getNorth();
    var south = bounds.getSouth();
    var west = bounds.getWest();
    clusterFeatureGroup.clearLayers();

    showLoader(true);

    var urlll = "php/getNigerData.php?east=" + east + "&north=" + north + "&south=" + south + "&west=" + west;
    fieldss = [];
    fieldss.push("admin1name");
    fieldss.push("admin1refn");
    smasAddPolygons(urlll, fieldss);

}

function highlightFeature(e) {
    var layer = e.target;

    layer.setStyle({
        weight: 5,
        color: '#666',
        dashArray: '',
        fillOpacity: 0.7
    });

    if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
        layer.bringToFront();
    }
    info.update(layer.toGeoJSON().features[0].properties);
}

function resetHighlight(e) {
    var layer = e.target;

    layer.setStyle({
        weight: 2,
        opacity: 1,
        color: 'white',
        dashArray: '2',
        fillOpacity: 0.7
    });

    info.update();
}
