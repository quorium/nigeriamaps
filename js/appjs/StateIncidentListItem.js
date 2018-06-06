/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


class StateIncidentListItem {
    constructor(name, properties) {
        // invokes the setter
        this.name = name;
        this.properties = properties;
        this.addGui(this);
    }
    get name() {
        return this._name;
    }
    set name(value) {
        this._name = value;
    }
    get properties() {
        return this._properties;
    }
    set properties(value) {
        this._properties = value;
    }
    get innerHttml(){
        return this._this.innerHttml;
    }
    set innerHttml(value){
        this._innerHttml = value;
    }
    addGui(thisthis) {
        
        var imgUrl = "images/Nigeria-Flag-icon.png";
        //var trtd = $("<tr style='background-color : "+this._properties[ colorKey]+"'></tr>");
        var trtd = $("<tr></tr>");
        var tabbb = $("<table style='width:100%;     border: 1px solid; '  ></table>");
        var imgg = $("<td valign='top' width='50px'><img src=" + imgUrl + " height=\"50\" /></td>");
//        imgg.appendTo(tabbb);
        var k = "";
        var propTab = $("<table  style='width:100%;      ' ></table>");
        for (k in this._properties) {
            if (k != colorKey ){
                var val =  this._properties[k] ;
                if (k == eventdateKey){
                   val = formatDate (val);
                }
                var kk = k.replace("_"," ");
                $("<tr><td width='120px'> <b>" + kk + ":</b> </td><td>" +val + "</td></tr>").appendTo(propTab);
            }
            
        }
        var ttd = $("<td></td>");
        $(propTab).appendTo(ttd);
        var fRw = $("<tr></tr>");
        $(imgg).appendTo(fRw);
        $(ttd).appendTo(fRw);
        $(fRw).appendTo(tabbb);
         
         
        

//        $("<tr><td><a id='inci_" + this._properties + "'>Show Incidents</td></tr>").appendTo(tabbb);
//        $("<tr><td>Last Updated on 20 Jan 2018<td></tr>").appendTo(tabbb);
        $(tabbb).appendTo(trtd);
        thisthis._innerHttml=trtd;
        $(thisthis._innerHttml).data('incidentItem',thisthis);
        $(trtd).appendTo("#incidentTab");

//        $("#inci_" + this._properties["location"]).click(function () {
//            //stateCustomList.selected
////            alert(this.id);
//        });
    }

}
