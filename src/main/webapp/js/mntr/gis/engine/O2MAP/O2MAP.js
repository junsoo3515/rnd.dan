
/**
 * @requires OpenLayers/Layer/XYZ.js
 */

TileMapBase = OpenLayers.Class(OpenLayers.Layer.XYZ, {

    name: "BaseMap",
    url: [
          gisUrlBase + "/${z}/Y${y}/X${x}.png"
    ],
    maxExtent: new OpenLayers.Bounds(974510, 1795754, 1006958, 1834503), //지도가 표시될 최대영역 설정
	sphericalMercator: false,
	transitionEffect: "resize",
	buffer: 1,
	projection: new OpenLayers.Projection("EPSG:5179"),
	displayOutsideMaxExtent: false,
    initialize: function(name, options) {
        var newArgs = [name, null, options];
        OpenLayers.Layer.XYZ.prototype.initialize.apply(this, newArgs);
    },
    clone: function(obj) {
        if (obj == null) {
            obj = new OpenLayers.Layer.Naver(
                this.name, this.getOptions());
        }
        obj = OpenLayers.Layer.XYZ.prototype.clone.apply(this, [obj]);
        return obj;
    },
	getXYZ: function(bounds) {
        var res = this.getServerResolution();
        var x = Math.round((bounds.left - this.maxExtent.left) /
            (res * this.tileSize.w));
        var y = Math.round((bounds.bottom - this.maxExtent.bottom) /
            (res * this.tileSize.h));
        var z = this.getServerZoom();

        if (this.wrapDateLine) {
            var limit = Math.pow(2, z);
            x = ((x % limit) + limit) % limit;
        }
        return {'x': x, 'y': y, 'z': z};
    },
	
    CLASS_NAME: "TileMapBase"
});




AirMapBase = OpenLayers.Class(OpenLayers.Layer.XYZ, {

    name: "AirMap",
    url: [
          gisUrlAerial + "/${z}/Y${y}/X${x}.jpg"
    ], 
    maxExtent: new OpenLayers.Bounds(974510, 1795754, 1006958, 1834503), //지도가 표시될 최대영역 설정
	sphericalMercator: false,
	transitionEffect: "resize",
	buffer: 1,
	projection: new OpenLayers.Projection("EPSG:5179"),
	displayOutsideMaxExtent: false,
    initialize: function(name, options) {
        var newArgs = [name, null, options];
        OpenLayers.Layer.XYZ.prototype.initialize.apply(this, newArgs);
    },
    clone: function(obj) {
        if (obj == null) {
            obj = new OpenLayers.Layer.Naver(
                this.name, this.getOptions());
        }
        obj = OpenLayers.Layer.XYZ.prototype.clone.apply(this, [obj]);
        return obj;
    },
	getXYZ: function(bounds) {
        var res = this.getServerResolution();
        var x = Math.round((bounds.left - this.maxExtent.left) /
            (res * this.tileSize.w));
        var y = Math.round((bounds.bottom - this.maxExtent.bottom) /
            (res * this.tileSize.h));
        var z = this.getServerZoom();

        if (this.wrapDateLine) {
            var limit = Math.pow(2, z);
            x = ((x % limit) + limit) % limit;
        }
        return {'x': x, 'y': y, 'z': z};
    },
	
    CLASS_NAME: "TileMapBase"
});