/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */



L.Control.Search = L.Control.extend({
    options: {
        // topright, topleft, bottomleft, bottomright
        position: 'topleft',
        placeholder: 'Search...'
    },
    initialize: function (options /*{ data: {...}  }*/) {
        // constructor
        L.Util.setOptions(this, options);
    },
    onAdd: function (map) {
        // happens after added to map
        var container = L.DomUtil.create('div', 'search-container');
        this.form = L.DomUtil.create('form', 'form', container);
        var group = L.DomUtil.create('div', 'form-group', this.form);
        this.input = L.DomUtil.create('input', 'form-control input-sm', group);
        this.input.type = 'text';
        this.input.placeholder = this.options.placeholder;
        this.searchRangeDiv = L.DomUtil.create('div', 'searchRan', group);
        this.searchRangeDiv.placeholder = this.options.placeholder;
        this.searchRangeDiv.id = searchRangeOptDiv;

        this.results = L.DomUtil.create('div', 'list-group', group);
        L.DomEvent.addListener(this.input, 'keyup', debounce(this.keyup, 300), this);
        L.DomEvent.addListener(this.form, 'submit', this.submit, this);
        L.DomEvent.disableClickPropagation(container);
        return container;
    },
    onRemove: function (map) {
        // when removed
//        L.DomEvent.removeListener(this._input, 'keyup', this.keyup, this);
//        L.DomEvent.removeListener(form, 'submit', this.submit, this);
    },
    keyup: function (e) {
        if (e.keyCode === 38 || e.keyCode === 40) {
            // do nothing
        } else {
            this.results.innerHTML = '';
            if (this.input.value.length > 1) {
                var value = this.input.value;
                var results = _.take(_.filter(this.options.data, function (x) {
//                    return x.feature.properties.park.toUpperCase().indexOf(value.toUpperCase()) > -1;
//
                    //sasti logic
                    if (x.toGeoJSON().features[0].properties["admin"] != undefined){
                       return x.toGeoJSON().features[0].properties["admin"].toUpperCase().indexOf(value.toUpperCase()) > -1;
                    }
                    if (x.toGeoJSON().features[0].properties["LGA"] != undefined){
                       return x.toGeoJSON().features[0].properties["LGA"].toUpperCase().indexOf(value.toUpperCase()) > -1;
                    }
                    
                    return false;

                }).sort(sortParks), 10);
                _.map(results, $.proxy(function (x) {
                    var a = L.DomUtil.create('a', 'list-group-item');
                    a.href = '';
                    //sasti logic
                    if (x.toGeoJSON().features[0].properties["admin"] != undefined){
                       a.setAttribute('data-result-name', x.toGeoJSON().features[0].properties["admin"]);
                    a.innerHTML = x.toGeoJSON().features[0].properties["admin"];
                    
                    }
                    if (x.toGeoJSON().features[0].properties["LGA"] != undefined){
                       a.setAttribute('data-result-name', x.toGeoJSON().features[0].properties["LGA"]);
                    a.innerHTML = x.toGeoJSON().features[0].properties["LGA"];
                    
                    }
                    
                    this.results.appendChild(a);
                    L.DomEvent.addListener(a, 'click', this.itemSelected, this);
                    return a;
                }, this));
            }
        }
    },
    itemSelected: function (e) {
        L.DomEvent.preventDefault(e);
        var elem = e.target;
        var value = elem.innerHTML;
        this.input.value = elem.getAttribute('data-result-name');
        var feature = _.find(this.options.data, $.proxy(function (x) {
//            return x.feature.properties.park === this.input.value;
            return x.toGeoJSON().features[0].properties["admin"] === this.input.value;

        }, this));
        if (feature) {
//            $("#inci_"+feature.stateItem.name).click();
            stateCustomList.stateList[feature.stateItem.name].layer.fire('click');
//            this._map.fitBounds(feature.getBounds());
        }
        this.results.innerHTML = '';
    },
    submit: function (e) {
        L.DomEvent.preventDefault(e);
    }
});
L.control.search = function (id, options) {
    return new L.Control.Search(id, options);
}
