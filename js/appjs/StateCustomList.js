/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
class StateCustomList {
    constructor(id) {
        // invokes the setter
        this.name = id;
        this.stateList = {};
        this.selected = null;
        this.addGui();
        updateSelectedState();
        this.sort_AZ= "sort_AZ";
        this.sort_ZA= "sort_ZA";
    }
    get name() {
        return this._containerId;
    }
    get stateList() {
        return this._stateList;
    }
get selected(){
        return this._selected;
    }
    set name(value) {
        this._containerId = value;
    }
    set stateList(value) {
        this._stateList = value;
    }
    set selected(value){
        this._selected = value;
        updateSelectedState();
    }
    addGui() {
        $("#" + this._containerId).empty();
        $("<ul class=\"product-list-vertical\" id='stateList'></ul>").appendTo("#" + this._containerId);
    }
    addItem(stateCustomListItem) {
        if (this._stateList[stateCustomListItem.name] != undefined) {
            $("#" + stateCustomListItem.name).remove();
        }
        this._stateList[stateCustomListItem.name] = stateCustomListItem;
        $(stateCustomListItem.htmlContent).appendTo("#" + this._containerId);
    }
    

}

