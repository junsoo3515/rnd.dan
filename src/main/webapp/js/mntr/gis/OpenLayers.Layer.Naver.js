/* Copyright (c) 2006-2012 by OpenLayers Contributors (see authors.txt for 
 * full list of contributors). Published under the 2-clause BSD license.
 * See license.txt in the OpenLayers distribution or repository for the
 * full text of the license. */

/**
 * @requires OpenLayers/Layer/XYZ.js
 */

OpenLayers.Layer.Naver = OpenLayers.Class(OpenLayers.Layer.XYZ, {

    name: "NaverMap",
    url: [
		"http://onetile1.map.naver.net/get/146/0/0/${z}/${x}/${y}/bl_vc_bg/ol_vc_an",
		"http://onetile2.map.naver.net/get/146/0/0/${z}/${x}/${y}/bl_vc_bg/ol_vc_an",
		"http://onetile3.map.naver.net/get/146/0/0/${z}/${x}/${y}/bl_vc_bg/ol_vc_an",
		"http://onetile4.map.naver.net/get/146/0/0/${z}/${x}/${y}/bl_vc_bg/ol_vc_an"
    ],
	resolutions: [1024, 512, 256, 128, 64, 32, 16, 8, 4, 2, 1, 0.5, 0.25],
/*	attribution: '<a href="http://www.nhncorp.com" target="_blank" style="text-decoration: none !important;">© <span style="display: inline; font-family: Tahoma,sans-serif !important; font-size: 9px !important; font-weight: bold !important; font-style: normal !important; color: #009BC8 !important; text-decoration: none !important;">'
		+ 'NHN Corp.</span></a>'
		+ '<img class="nmap_logo_map" src="http://static.naver.net/maps2/logo_naver_s.png" width="43" height="9" alt="NAVER">',*/
	sphericalMercator: false,
	transitionEffect: "resize",
	buffer: 1,
	numZoomLevels: 13,
	minResolution: 0.25,
	maxResolution: 1024,
	units: "m",
	projection: new OpenLayers.Projection("EPSG:5179"),
	displayOutsideMaxExtent: false,
	maxExtent: new OpenLayers.Bounds(90112, 1192896, 1990673, 2761664),
    initialize: function(name, options) {
		if (!options) options = {resolutions: [1024, 512, 256, 128, 64, 32, 16, 8, 4, 2, 1, 0.5, 0.25]};
		else if (!options.resolutions) options.resolutions = [1024, 512, 256, 128, 64, 32, 16, 8, 4, 2, 1, 0.5, 0.25];
        //var newArgs = [name, null, options];
        OpenLayers.Layer.XYZ.prototype.initialize.apply(this, [name, null, options]);
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
        var z = this.getServerZoom() + 2;

        if (this.wrapDateLine) {
            var limit = Math.pow(2, z);
            x = ((x % limit) + limit) % limit;
        }

        return {'x': x, 'y': y, 'z': z};
    },
	
    CLASS_NAME: "OpenLayers.Layer.Naver"
});

OpenLayers.Layer.Naver.Aerial = OpenLayers.Class(OpenLayers.Layer.XYZ, {

    name: "NaverMapAerial",
    url: [
		"http://onetile1.map.naver.net/get/146/0/1/${z}/${x}/${y}/bl_st_bg",
		"http://onetile2.map.naver.net/get/146/0/1/${z}/${x}/${y}/bl_st_bg",
		"http://onetile3.map.naver.net/get/146/0/1/${z}/${x}/${y}/bl_st_bg",
		"http://onetile4.map.naver.net/get/146/0/1/${z}/${x}/${y}/bl_st_bg"
    ],
	resolutions: [1024, 512, 256, 128, 64, 32, 16, 8, 4, 2, 1, 0.5, 0.25],
/*	attribution: '<a href="http://www.nhncorp.com" target="_blank" style="text-decoration: none !important;">© <span style="display: inline; font-family: Tahoma,sans-serif !important; font-size: 9px !important; font-weight: bold !important; font-style: normal !important; color: #009BC8 !important; text-decoration: none !important;">'
		+ 'NHN Corp.</span></a>'
		+ '<img class="nmap_logo_map" src="http://static.naver.net/maps2/logo_naver_s.png" width="43" height="9" alt="NAVER">',*/
	sphericalMercator: false,
	transitionEffect: "resize",
	buffer: 1,
	numZoomLevels: 13,
	minResolution: 0.25,
	maxResolution: 1024,
	units: "m",
	projection: new OpenLayers.Projection("EPSG:5179"),
	displayOutsideMaxExtent: false,
	maxExtent: new OpenLayers.Bounds(90112, 1192896, 1990673, 2761664),
    initialize: function(name, options) {
		if (!options) options = {resolutions: [1024, 512, 256, 128, 64, 32, 16, 8, 4, 2, 1, 0.5, 0.25]};
		else if (!options.resolutions) options.resolutions = [1024, 512, 256, 128, 64, 32, 16, 8, 4, 2, 1, 0.5, 0.25];
        //var newArgs = [name, null, options];
        OpenLayers.Layer.XYZ.prototype.initialize.apply(this, [name, null, options]);
    },
    clone: function(obj) {
        if (obj == null) {
            obj = new OpenLayers.Layer.Naver.Aerial(
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
        var z = this.getServerZoom() + 2;

        if (this.wrapDateLine) {
            var limit = Math.pow(2, z);
            x = ((x % limit) + limit) % limit;
        }

        return {'x': x, 'y': y, 'z': z};
    },
	
    CLASS_NAME: "OpenLayers.Layer.Naver.Aerial"
});

OpenLayers.Layer.Naver.AerialOveray = OpenLayers.Class(OpenLayers.Layer.XYZ, {

    name: "NaverMap.AerialOveray",
    url: [
		"http://onetile1.map.naver.net/get/146/0/0/${z}/${x}/${y}/empty/ol_st_rd/ol_st_an",
		"http://onetile2.map.naver.net/get/146/0/0/${z}/${x}/${y}/empty/ol_st_rd/ol_st_an",
		"http://onetile3.map.naver.net/get/146/0/0/${z}/${x}/${y}/empty/ol_st_rd/ol_st_an",
		"http://onetile4.map.naver.net/get/146/0/0/${z}/${x}/${y}/empty/ol_st_rd/ol_st_an"
    ],
	resolutions: [1024, 512, 256, 128, 64, 32, 16, 8, 4, 2, 1, 0.5, 0.25],
/*	attribution: '<a href="http://www.nhncorp.com" target="_blank" style="text-decoration: none !important;">© <span style="display: inline; font-family: Tahoma,sans-serif !important; font-size: 9px !important; font-weight: bold !important; font-style: normal !important; color: #009BC8 !important; text-decoration: none !important;">'
		+ 'NHN Corp.</span></a>'
		+ '<img class="nmap_logo_map" src="http://static.naver.net/maps2/logo_naver_s.png" width="43" height="9" alt="NAVER">',*/
	sphericalMercator: false,
	transitionEffect: "resize",
	buffer: 1,
	numZoomLevels: 13,
	minResolution: 0.25,
	maxResolution: 1024,
	units: "m",
	projection: new OpenLayers.Projection("EPSG:5179"),
	displayOutsideMaxExtent: false,
	maxExtent: new OpenLayers.Bounds(90112, 1192896, 1990673, 2761664),
    initialize: function(name, options) {
		if (!options) options = {resolutions: [1024, 512, 256, 128, 64, 32, 16, 8, 4, 2, 1, 0.5, 0.25]};
		else if (!options.resolutions) options.resolutions = [1024, 512, 256, 128, 64, 32, 16, 8, 4, 2, 1, 0.5, 0.25];
        //var newArgs = [name, null, options];
        OpenLayers.Layer.XYZ.prototype.initialize.apply(this, [name, null, options]);
    },
    clone: function(obj) {
        if (obj == null) {
            obj = new OpenLayers.Layer.Naver.AerialOveray(
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
        var z = this.getServerZoom() + 2;

        if (this.wrapDateLine) {
            var limit = Math.pow(2, z);
            x = ((x % limit) + limit) % limit;
        }

        return {'x': x, 'y': y, 'z': z};
    },
	
    CLASS_NAME: "OpenLayers.Layer.Naver.AerialOveray"
});
