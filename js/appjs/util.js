/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


function resetHighlight(layer) {
    var layer = e.target;
    layer.setStyle({
        weight: 2,
        opacity: 1,
        color: 'white',
        dashArray: '2',
        fillOpacity: 0.7
    });
//    info.update();
}

function toggleSideSearch() {
    if (sideSearchVisible) {
        $("#sideWrapper").hide('slow');
        $("#map").css('width', '100%');
        $("#sideButton").css('right', '0%');
        sideSearchVisible = false;
    } else {
        $("#sideWrapper").show('slow');
        $("#map").css('width', '75%');
        $("#sideButton").css('right', '25%');
        sideSearchVisible = true;
    }

}

function addSearchRangeUi() {

    $("<p><b>Select Duration</b></p>").appendTo("#" + searchRangeOptDiv);
    $("<input type = 'radio' name = 'dRange' value = " + range_3d + ">&nbsp;Past three days.</input><br>").appendTo("#" + searchRangeOptDiv);
    $("<input type = 'radio' name = 'dRange' value = " + range_1w + ">&nbsp;Past week.</input><br>").appendTo("#" + searchRangeOptDiv);
    $("<input type = 'radio' name = 'dRange' value = " + range_1m + ">&nbsp;Past month.</input><br>").appendTo("#" + searchRangeOptDiv);
    $("<input type = 'radio' name = 'dRange' value = " + range_3m + ">&nbsp;Past three months.</input><br>").appendTo("#" + searchRangeOptDiv);
    $("<input type = 'radio' name = 'dRange' value = " + range_6m + ">&nbsp;Past six months.</input><br>").appendTo("#" + searchRangeOptDiv);

//    $("<span>Custom Date Range</span><br>").appendTo("#" + searchRangeOptDiv);
//    $("<hr>").appendTo("#" + searchRangeOptDiv);
//    $("<span>Custom Date Range</span><br>").appendTo("#" + searchRangeOptDiv);
//    $("<input type = 'radio' name = 'dRange' value = '3dd'>Past three days.</input><br>").appendTo("#" + searchRangeOptDiv);
//    $("<hr>").appendTo("#" + searchRangeOptDiv);
    radioOnChange();
    if (radSelVal == "") {
        radSelVal = range_6m;
    }
    $('input[name=dRange][value=' + radSelVal + ']').attr('checked', true); // or 'checked'

}


function customBubbleSort(lis) {
//will sort based on number of events
//var lis = stateIncidentList.stateIncidentList;

    var arr = [];
    for (k in lis) {
        var obj = {};
        obj.name = k;
        obj.Lenn = lis[k].length;
        arr.push(obj);
    }

    var len = arr.length;
    for (var i = len - 1; i >= 0; i--) {
        for (var j = 1; j <= i; j++) {
            if (arr[j - 1]["Lenn"] > arr[j]["Lenn"]) {
                var temp = arr[j - 1];
                arr[j - 1] = arr[j];
                arr[j] = temp;
            }
        }
    }
    return arr;
}


function customBubbleSortDate(lis, sortType) {
//will sort based on date of event occurance
//var lis = stateIncidentList.stateIncidentList;

    var arr = [];
    for (k in lis) {
        for (var i = 0; i < lis[k].length; i++) {
            var obj = {};
            obj[eventdateKey] = lis[k][i].properties[eventdateKey];
            obj.htmlCont = lis[k][i]._innerHttml;
            obj.originalObj = lis[k][i];
            obj.sItem = lis[k][i];
            arr.push(obj);
        }
    }

    var len = arr.length;

    if (sortType == stateIncidentList.sort_DaAs) {
        for (var i = len - 1; i >= 0; i--) {
            for (var j = 1; j <= i; j++) {
                if (arr[j - 1][eventdateKey] > arr[j][eventdateKey]) {
                    var temp = arr[j - 1];
                    arr[j - 1] = arr[j];
                    arr[j] = temp;
                }
            }
        }
    } else if (sortType == stateIncidentList.sort_DaDes) {
        for (var i = len - 1; i >= 0; i--) {
            for (var j = 1; j <= i; j++) {
                if (arr[j - 1][eventdateKey] < arr[j][eventdateKey]) {
                    var temp = arr[j - 1];
                    arr[j - 1] = arr[j];
                    arr[j] = temp;
                }
            }
        }
    }


    return arr;
}
function customBubbleSortInciType(lis, sortType) {
//will sort based on name of Incident type
//var lis = stateIncidentList.stateIncidentList;
debugger;
    var arr = [];
    for (k in lis) {
        arr.push(k);
    }
    if (sortType == stateIncidentList.sort_InciTypeAs) {
        arr.sort();
    } else if (sortType == stateIncidentList.sort_InciTypeDes) {
        arr.sort();
        arr.reverse();
    }

    return arr;
}

function debounce(func, wait, immediate) {
// 'private' variable for instance
// The returned function will be able to reference this due to closure.
// Each call to the returned function will share this common timer.
    var timeout;
    // Calling debounce returns a new anonymous function
    return function () {
        // reference the context and args for the setTimeout function
        var context = this,
                args = arguments;
        // Should the function be called now? If immediate is true
        //   and not already in a timeout then the answer is: Yes
        var callNow = immediate && !timeout;
        // This is the basic debounce behaviour where you can call this 
        //   function several times, but it will only execute once 
        //   [before or after imposing a delay]. 
        //   Each time the returned function is called, the timer starts over.
        clearTimeout(timeout);
        // Set the new timeout
        timeout = setTimeout(function () {

            // Inside the timeout function, clear the timeout variable
            // which will let the next execution run when in 'immediate' mode
            timeout = null;
            // Check if the function already ran with the immediate flag
            if (!immediate) {
                // Call the original function with apply
                // apply lets you define the 'this' object as well as the arguments 
                //    (both captured before setTimeout)
                func.apply(context, args);
            }
        }, wait);
        // Immediate mode and no wait timer? Execute the function..
        if (callNow)
            func.apply(context, args);
    };
}
;
function sortParks(a, b) {
//    var _a = a.feature.properties.park;
//    var _b = b.feature.properties.park;
    var _a = a.toGeoJSON().features[0].properties["admin"];
    var _b = b.toGeoJSON().features[0].properties["admin"];
    if (_a < _b) {
        return -1;
    }
    if (_a > _b) {
        return 1;
    }
    return 0;
}

function highlightFeature(layer) {
//    var layer = e.target;

    layer.setStyle({
        weight: 5,
        color: '#666',
        dashArray: '',
        fillOpacity: 0.7
    });
    if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
        layer.bringToFront();
    }
//    info.update(layer.toGeoJSON().features[0].properties);
}

function updateSelectedState() {
    if (stateCustomList == undefined) {
        return;
    }
    if (stateCustomList.selected == null) {
        $("#stateHeader").hide();
        $("#searchRange").hide();
        $("#stateHeaderText").text("");
    } else {

        $("#stateHeader").show();
        $("#searchRange").show();
        $("#stateHeaderText").text("You are viewing incidents of " + stateCustomList.selected.name);
    }
}
function updateSelectedIncident() {

    if (stateIncidentList == undefined) {
        return;
    }
    if (stateIncidentList.selectedIncident == null) {
        $("#stateHeader").hide();
        $("#searchRange").hide();
        $("#stateHeaderText").text("");
    } else {

        $("#stateHeader").show();
        $("#searchRange").show();
        $("#stateHeaderText").text("You are viewing "+stateIncidentList.selectedIncident.name+" incidents of " + stateCustomList.selected.name);
    }
}
//function drawAllGraphs() {
//    var dataSet = [];
//    var labels = [];
//    for (k in stateIncidentList.stateIncidentList) {
//        dataSet.push(stateIncidentList.stateIncidentList[k].length);
//        labels.push(k);
//    }
//    if (!undefined == allIncidentTrendChart){
//        allIncidentTrendChart.destroy();
//    }
//    
//    allIncidentTrendChart  = new Chart(document.getElementById("line-chart-11"), {
//        type: 'bar',
//        data: {
//            labels: labels,
//            datasets: [{
//                    label: '# of Votes',
//                    data: dataSet,
//                    backgroundColor: [
//                        'rgba(255, 99, 132, 0.2)',
//                        'rgba(54, 162, 235, 0.2)',
//                        'rgba(255, 206, 86, 0.2)',
//                        'rgba(75, 192, 192, 0.2)',
//                        'rgba(153, 102, 255, 0.2)',
//                        'rgba(255, 159, 64, 0.2)'
//                    ],
//                    borderColor: [
//                        'rgba(255,99,132,1)',
//                        'rgba(54, 162, 235, 1)',
//                        'rgba(255, 206, 86, 1)',
//                        'rgba(75, 192, 192, 1)',
//                        'rgba(153, 102, 255, 1)',
//                        'rgba(255, 159, 64, 1)'
//                    ],
//                    borderWidth: 1
//                }]
//        },
//        options: {
//            scales: {
//                yAxes: [{
//                        ticks: {
//                            beginAtZero: true
//                        }
//                    }]
//            }
//        }
//    });
//}

function drawAllGraphs() {

    var dataSetsArr = [];
    var labels = [];
    if (!undefined == allIncidentTrendChart) {
        allIncidentTrendChart.destroy();
    }
    if ($.isEmptyObject(stateIncidentList.stateIncidentList)) {
        var ddd = [];
        var dd = new Date();
        for (var i = 1; i <= 3; i++) {
            var cObj = {};
            cObj.x = dd;
            cObj.y = 0;
            ddd.push(cObj);
            dd.setDate(dd.getDate() - i);
        }
        labels.push("");
        var c = getNextColor();
        var dObj = {
            label: "",
            data: ddd,
//            type: 'bar',
            pointRadius: 0,
            fill: false,
            backgroundColor: c,
            borderColor: c,
            lineTension: 0,
            borderWidth: 2,
            borderDash: [5, 5]
        };
        dataSetsArr.push(dObj);

    }
    var tq = 0;
    for (k in stateIncidentList.stateIncidentList) {
        var c = getNextColor();
        tq++;
        var ddd = [];
        console.log(stateIncidentList.stateIncidentList[k].length);
        if (stateIncidentList.stateIncidentList[k].length > 0) {
            c = stateIncidentList.stateIncidentList[k][0].properties[colorKey];
            for (var i = 0; i < stateIncidentList.stateIncidentList[k].length; i++) {
                var cObj = {};
                cObj.x = new Date(stateIncidentList.stateIncidentList[k][i].properties[eventdateKey]);
                cObj.y = 1;
                ddd.push(cObj);
            }
        } else {

        }
        labels.push(k);
        
        var dObj = {
            label: k,
            data: ddd,
//            type: 'bar',
//            pointRadius: 0,
            fill: true,
            backgroundColor: c,
            borderColor: "#00000",
//            lineTension: 0,
//            borderWidth: 2,
            borderDash: [5, 5]
        };
        dataSetsArr.push(dObj);
//        if (dObj.data.length > 0) {
            var iddd = "line-single-" + tq;
            new Chart(document.getElementById(iddd), {
                type: 'line',
                data: {
//            labels: labels,
                    datasets: [dObj]
                },
                options: {
                    responsive: false,
//                maintainAspectRatio: false,
                    scales: {
                        xAxes: [{
                                type: 'time',
                                time: {
                                    displayFormats: {
                                        quarter: 'MMM YYYY'
                                    }
                                },
                                ticks: {
//                                    min: moment(1471174953000),
                                    suggestedMax: moment(new Date())
                                }
                            }],
                        yAxes: [{
                                scaleLabel: {
                                    display: true,
                                    labelString: dObj.label
                                },
                                ticks: {
                                    beginAtZero: true,
                                    suggestedMax: 2,
                                    callback: function (value) {
                                        if (value % 1 === 0) {
                                            return value;
                                        }
                                    }
                                }
                            }]
                    }
                }
            });
//        }

    }
//
//    allIncidentTrendChart = new Chart(document.getElementById("line-chart-11"), {
//        type: 'bar',
//        data: {
////            labels: labels,
//            datasets: dataSetsArr,
//            responsive: true
//        },
//        options: {
//            responsive: true,
//            maintainAspectRatio: false,
//            scales: {
//                xAxes: [{
//                        type: 'time',
//                        time: {
//                            displayFormats: {
//                                quarter: 'MMM YYYY'
//                            }
//                        }
//                    }],
//                yAxes: [{
//                        scaleLabel: {
//                            display: true,
//                            labelString: 'Incident Count'
//                        },
//                        ticks: {
//                            beginAtZero: true
//                        }
//                    }]
//            }
//        }
//    });
}
var colorIndex = 0;
var colorNames = ["red", "orange", "yellow", "purple", "grey", "green", "blue", "pink", "aqua", "crimson"];
window.chartColors = {
    red: 'rgb(255, 99, 132)',
    aqua: 'rgb(0,255,255)',
    orange: 'rgb(255, 159, 64)',
    yellow: 'rgb(255, 205, 86)',
    crimson: 'rgb(220,20,60)',
    green: 'rgb(75, 192, 192)',
    blue: 'rgb(54, 162, 235)',
    pink: 'rgb(255,192,203)',
    purple: 'rgb(153, 102, 255)',
    grey: 'rgb(201, 203, 207)'
};
function getNextColor() {
    if (colorIndex > (colorNames.length - 1)) {
        colorIndex = 0;
    }
    c = window.chartColors[colorNames[colorIndex]];
    colorIndex++;
    return  c;
}

function getSearchDateParams() {
    dObj = {};
    dObj.fromDate = "";
    dObj.toDate = "";
    var d = new Date();
    var radioVal = $('input[name=dRange]:checked').val();
    if (radioVal == range_3d) {
        dObj.toDate = d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate();
        var fD = new Date();
        fD.setDate(fD.getDate() - 3);
        dObj.fromDate = fD.getFullYear() + "-" + fD.getMonth() + "-" + fD.getDate();
    } else if (radioVal == range_1w) {
        dObj.toDate = d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate();
        var fD = new Date();
        fD.setDate(fD.getDate() - 7);
        dObj.fromDate = fD.getFullYear() + "-" + fD.getMonth() + "-" + fD.getDate();
    } else if (radioVal == range_3d) {
        dObj.toDate = d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate();
        var fD = new Date();
        fD.setDate(fD.getDate() - 3);
        dObj.fromDate = fD.getFullYear() + "-" + fD.getMonth() + "-" + fD.getDate();
    } else if (radioVal == range_1m) {
        dObj.toDate = d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate();
        var fD = new Date();
        fD.setMonth(fD.getMonth() - 1);
        dObj.fromDate = fD.getFullYear() + "-" + (fD.getMonth() + 1) + "-" + fD.getDate();
    } else if (radioVal == range_3m) {
        dObj.toDate = d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate();
        var fD = new Date();
        fD.setMonth(fD.getMonth() - 3);
        dObj.fromDate = fD.getFullYear() + "-" + (fD.getMonth() + 1) + "-" + fD.getDate();
    } else if (radioVal == range_6m) {
        dObj.toDate = d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate();
        var fD = new Date();
        fD.setMonth(fD.getMonth() - 6);
        dObj.fromDate = fD.getFullYear() + "-" + (fD.getMonth() + 1) + "-" + fD.getDate();
    }
    return dObj;
}

function radioOnChange() {
    $('input[type=radio][name=dRange]').change(function () {
        radSelVal = $('input[name=dRange]:checked').val();
        stateEventsPinModule(stateCustomList.selected.name);
    });
}


function formatDate(dat) {
    var date = new Date(dat);
  var monthNames = [
    "Jan", "Feb", "Mar",
    "Apr", "May", "Jun", "Jul",
    "Aug", "Sep", "Oct",
    "Nov", "Dec"
  ];

  var day = date.getDate();
  var monthIndex = date.getMonth();
  var year = date.getFullYear();

  return monthNames[monthIndex]+ ' ' +day + ',' + year;
}