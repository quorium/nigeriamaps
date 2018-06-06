/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


class StateCustomListItem {
    constructor(name, layer) {
        // invokes the setter
        this.name = name;
        this.layer = layer;
        this.addGui();
    }
    get name() {
        return this._name;
    }
    set name(value) {
        this._name = value;
    }
    get layer() {
        return this._layer;
    }
    set layer(value) {
        this._layer = value;
    }

    addGui() {
        var imgUrl = "images/Nigeria-Flag-icon.png";


        // var lli = $("<li id=" + this._name + "></li>");
        // var imgg = $("<img src=" + imgUrl + " height=\"50\" />");
        // var ddiv = $("<div style='float: right;' class=\"product-details\"></div>");
        // imgg.appendTo(lli);
        // $("<b><a class='inci_" + this._name + "' id='inci_" + this._name + "'>" + this._name + "</b>").appendTo(ddiv);
        // $("<br><a class='inci_" + this._name + "' id = 'inci_" + this._name + "'>Show Incidents</b>").appendTo(ddiv);
        // $("<p class=\"product-description\">Data last updated on 20 Jan 2018</p>").appendTo(ddiv);
        // $(ddiv).appendTo(lli);
        // $(lli).appendTo("#stateList");


        var lli = $("<li id=" + this._name + "></li>");

        var tab = $("<table></table>");
        

        var mainRow = $("<tr></tr>");

        var imggCol = $("<td><img src=" + imgUrl + " height=\"40\" /></td>");
        imggCol.appendTo(mainRow);

        var innertab = $("<table></table>");
        $("<tr><td><b><a class='inci_" + this._name + "' id='inci_" + this._name + "'>" + this._name + "</b></td></tr>").appendTo(innertab);
        $("<tr><td><a style='color: blue; text-decoration: underline;' class='inci_" + this._name + "' id = 'inci_" + this._name + "'>Show Incidents</b></td></tr>").appendTo(innertab);
        //$("<tr><td><span>Data last updated on 20 Jan 2018</span></td></tr>").appendTo(innertab);
        
        var secondTd = $("<td></td>");
        innertab.appendTo(secondTd);
        secondTd.appendTo(mainRow);            
        mainRow.appendTo(tab); 

        $(tab).appendTo(lli);



        $(lli).appendTo("#stateList");


        $(".inci_" + this._name).click(function () {
            var adminName = this.id.split("_")[1];
            stateCustomList.stateList[adminName]._layer.fire('click');
        });
    }

}
