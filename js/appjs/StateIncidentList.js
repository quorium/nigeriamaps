/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */



class StateIncidentList {
    constructor(id) {
        // invokes the setter
        this.name = id;
        this.stateIncidentList = {};
        this.filteredStateIncidentList = {};
        this.selectedIncident = null;
        this.addGui();
        updateSelectedIncident();

        this.sort_DaAs = sort_DaAs;
        this.sort_DaDes = sort_DaDes;
        this.sort_InciTypeAs = sort_InciTypeAs;
        this.sort_InciTypeDes = sort_InciTypeDes;
    }
    get name() {
        return this._containerId;
    }
    get selectedIncident() {
        return this._selectedIncident;
    }
    get stateIncidentList() {
        return this._stateIncidentList;
    }
    get filteredStateIncidentList() {
        return this._filteredStateIncidentList;
    }

    set name(value) {
        this._containerId = value;
    }
    set selectedIncident(value) {
        this._selectedIncident = value;
    }
    set stateIncidentList(value) {
        this._stateIncidentList = value;
    }
    set filteredStateIncidentList(value) {
        this._filteredStateIncidentList = value;
    }


    clearAll() {
        $("#incidentTab").empty();
    }
    addGui() {
        $("#" + this._containerId).empty();
        $("<ul class=\"product-list-vertical\" id='incidentList'></ul>").appendTo("#" + this._containerId);
        var lli = $("<li id='incidentDropDown'></li>");
        var selectt = $("<select id='sortSel'></select>");
        $("<option id="+sort_DaDes+">Date (most recent first)</option>").appendTo(selectt);
        $("<option id="+sort_DaAs+">Date (oldest first)</option>").appendTo(selectt);
        $("<option id="+sort_InciTypeAs+">Incident type (A-Z)</option>").appendTo(selectt);
        $("<option id="+sort_InciTypeDes+">Incident type (Z-A)</option>").appendTo(selectt);
        $("<span>Sort By </span>").appendTo(lli);
        
        $(selectt).appendTo(lli);
//        $("<button id= 'incidentsPrint'>Print</button>").appendTo(lli);
        $(lli).appendTo("#incidentList");
        
        $("<table id='incidentTab'  class='display' style='width:100%;     border: 1px solid; '></table>").appendTo("#incidentList");
//        $("#incidentsPrint").click(function () {
//            var printTab = $("<table id='incidentPT'></table>");
//            for (var i = 0; i < $("#incidentTab tr").length; i++) {
//                var printRow = $("<tr></tr>");
//                var trrArr = $($($("#incidentTab tr").get(i)).find('table').get(0)).find('tr');
//                for (var p = 0; p < trrArr.length; p++) {
//                    $($($(trrArr).get(p)).find('td')).appendTo(printRow);
//                }
//                $(printRow).appendTo(printTab);
//            }
//
//        });



$('#sortSel').on('change', function (e) {
    var optionSelected = $("option:selected", this);
    var valueSelected = $(optionSelected).get(0).id;
    stateIncidentList.sort(valueSelected);
    
});


    }
    addItem(stateIncidentListItem) {
        if (this._stateIncidentList[stateIncidentListItem.name] != undefined) {
            //$("#" + stateIncidentListItem.name).remove();
        } else {
            this._stateIncidentList[stateIncidentListItem.name] = [];
        }
        this._stateIncidentList[stateIncidentListItem.name].push(stateIncidentListItem);

        $(stateIncidentListItem.htmlContent).appendTo("#stateIncidentListArr");
    }
    addFilteredItem(filteredStateIncidentListItem) {
        if (this._filteredStateIncidentList[filteredStateIncidentListItem.name] != undefined) {
            
        } else {
            this._filteredStateIncidentList[filteredStateIncidentListItem.name] = [];

        }
        this._filteredStateIncidentList[filteredStateIncidentListItem.name].push(filteredStateIncidentListItem);
    }
    sort(sortType) {
        debugger;
        var lis = stateIncidentList.getVisibleList();
        stateIncidentList.clearAll();
        
        
        if (sortType == stateIncidentList.sort_InciTypeAs) {
            var sortedArr = customBubbleSortInciType(lis, stateIncidentList.sort_InciTypeAs);
            stateIncidentList.addSorted(sortedArr);
        } else if (sortType == stateIncidentList.sort_InciTypeDes) {
            var sortedArr = customBubbleSortInciType(lis, stateIncidentList.sort_InciTypeDes);
            stateIncidentList.addSorted(sortedArr);
        } else if (sortType == stateIncidentList.sort_DaAs) {
            var sortedArr = customBubbleSortDate(lis, stateIncidentList.sort_DaAs);
            stateIncidentList.addSortedDate(sortedArr);
        } else if (sortType == stateIncidentList.sort_DaDes) {
            var sortedArr = customBubbleSortDate(lis, stateIncidentList.sort_DaDes);
            stateIncidentList.addSortedDate(sortedArr);
        }

    }
    getVisibleList(){
        //Will return list of only those items which are currenlty shown in list
        var rowsArr = $($("#incidentTab").get(0)).children('tr');
        stateIncidentList.filteredStateIncidentList = {};
        for (var i = 0 ; i < rowsArr.length ; i ++){
             var stateItem = $(rowsArr[i]).data('incidentItem');
             stateIncidentList.addFilteredItem(stateItem);
        }
        return stateIncidentList.filteredStateIncidentList;

    }
    getLgaIncidentCount(lga){
        var c = 0;
        for (k in stateIncidentList.stateIncidentList){
            for (var i=0;i<stateIncidentList.stateIncidentList[k].length; i++){
                if (stateIncidentList.stateIncidentList[k][i].properties[lga_key] == lga){
                    c++;
                }
            }
        }
        return c;
    }
    filter (lga){
        //will filter data based on LGA
        stateIncidentList.clearAll();
        for (k in stateIncidentList.stateIncidentList){
            for (var i=0;i<stateIncidentList.stateIncidentList[k].length; i++){
                if (stateIncidentList.stateIncidentList[k][i].properties[lga_key] == lga){
                    var sItem = stateIncidentList.stateIncidentList[k][i];
                    $(sItem._innerHttml).appendTo("#incidentTab");
                    $(sItem._innerHttml).data('incidentItem',sItem);
                    debugger;
                }
            }
        }




    }
    addSorted(sortedArr) {
        for (var i = 0; i < sortedArr.length; i++) {
            for (var k = 0; k < stateIncidentList.filteredStateIncidentList[sortedArr[i]].length; k++) {
                var sItem = stateIncidentList.filteredStateIncidentList[sortedArr[i]][k];
                $(sItem._innerHttml).appendTo("#incidentTab");
                $(sItem._innerHttml).data('incidentItem',sItem);


            }
        }
    }
    addSortedDate(sortedArr) {
        for (var i = 0; i < sortedArr.length; i++) {
            var sItem = sortedArr[i].sItem;
            $(sortedArr[i].htmlCont).appendTo("#incidentTab");

            $(sItem._innerHttml).data('incidentItem',sItem);

        }
    }
}

