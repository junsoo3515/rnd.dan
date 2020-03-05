var _map = null;
var _zoom = null;
var _extent = null;

var partialMeasureCount = 0;
var measureControls = null;
var markers = null;
var bnExclusive = false;
var PAGES = {
	mode : "pan"
};

var sfL2 = null;
var _clicker = null;

var baseLayer = null;
var aerialLayer = null;

var vectorLayer = null;
var pointLayer = null;
var featureselectedLayer = null;
var lprLayer = null;

function mapInit(div) {
	OpenLayers.IMAGE_RELOAD_ATTEMPTS = 3;
	OpenLayers.Util.onImageLoadErrorColor = "transparent";
	
	_bounds = new OpenLayers.Bounds(Number(gisBoundsLeft), Number(gisBoundsBottom), Number(gisBoundsRight), Number(gisBoundsTop));
	_bounds.transform(new OpenLayers.Projection("WGS84"), new OpenLayers.Projection(gisProjection));
	_boundsWgs84 = new OpenLayers.Bounds(Number(gisBoundsLeft), Number(gisBoundsBottom), Number(gisBoundsRight), Number(gisBoundsTop));

	var options = {
		div : div,
		theme : null,
		controls : [],
		projection : new OpenLayers.Projection(gisProjection),
		// displayProjection : new OpenLayers.Projection("EPSG:4326"),
		units : "m",
		controls : [],
		numZoomLevels : 8,
		/*
		 * resolutions : [ 156543.0339, 78271.51695, 39135.758475, 19567.8792375, 9783.93961875, 4891.969809375, 2445.9849046875, 1222.99245234375, 611.496226171875,
		 * 305.7481130859375, 152.87405654296876, 76.43702827148438, 38.21851413574219, 19.109257067871095, 9.554628533935547, 4.777314266967774, 2.388657133483887,
		 * 1.1943285667419434, 0.5971642833709717, 0.29858214168548586, 0.14929107084274293 ],
		 */
		resolutions : [
				        76.43702827148438, 
				        38.21851413574219,
						19.109257067871095, 
						9.554628533935547, 
						4.777314266967774, 
						2.388657133483887, 
						1.1943285667419434, 
						0.5971642833709717, 
						
				],
				maxResolution : 76.43702827148438,
				restrictedExtent : _bounds,
				maxExtent : new OpenLayers.Bounds(-20037508.34, -20037508.34, 20037508.34, 20037508.34),
				eventListeners : {
					"zoomend" : zoomAction,
					"movestart" : moveStartAction,
					"moveend" : moveEndAction
		}
	};

	_map = new OpenLayers.Map("map", options);

	vworld.Layers.prototype.getURL = function(bounds) {
		bounds = this.adjustBounds(bounds);
		var res = this.map.getResolution();
		var x = Math.round((bounds.left - this.maxExtent.left) / (res * this.tileSize.w));
		var y = Math.round((this.maxExtent.top - bounds.top) / (res * this.tileSize.h));
		var z = this.map.getZoom() + 11;
		var path = "/" + z + "/" + x + "/" + y + "." + this.type;

		var url = this.url;
		if (url instanceof Array) {
			url = this.selectUrl(path, url);
		}
		return url + path;
	}

	// ======================================
	// 1. 배경지도 추가하기
	baseLayer = new vworld.Layers.Base('BaseMap');
	baseLayer.min_level = 1;
	baseLayer.max_level = 8;
	if (baseLayer != null) {
		_map.addLayer(baseLayer);
	}

	// 2. 영상지도 추가하기
	aerialLayer = new vworld.Layers.Satellite('AerialMap');
	aerialLayer.min_level = 1;
	aerialLayer.min_level = 8;
	if (aerialLayer != null) {
		_map.addLayer(aerialLayer);
	}

	vectorLayer = new OpenLayers.Layer.Vector("Vector Layer", {
		styleMap : new OpenLayers.Style({
			strokeColor : "#DDDDDD",
			strokeWidth : 2,
			fillColor : "#CCCCCC",
			fillOpacity : 0.2,
			fontColor : "#333333"
		})
	});

	pointLayer = new OpenLayers.Layer.Vector("pointLayer", {
		styleMap : new OpenLayers.Style({
			strokeColor : "#DDDDDD",
			strokeWidth : 2,
			fillColor : "#CCCCCC",
			fillOpacity : 0.2,
			fontColor : "#333333"
		})
	});

	featureselectedLayer = new OpenLayers.Layer.Vector('featureselectedLayer', {
		rendererOptions : {
			zIndexing : true
		}
	});
	
	lprLayer = new OpenLayers.Layer.Vector('lprLayer', {
		projection : new OpenLayers.Projection(gisProjection),
		rendererOptions : {
			zIndexing : true
		}
	});

	// Layers Add
	_map.addLayers([
			vectorLayer, pointLayer, featureselectedLayer, lprLayer
	]);

	// Controls Add
	// _map.addControl(new OpenLayers.Control.Attribution());
	_map.addControl(new OpenLayers.Control.MousePosition());
	_map.addControl(new OpenLayers.Control.PanZoomBarA());

	sfL2 = new OpenLayers.Control.SelectFeature([
		vectorLayer
	], {
		clickout : true,
		toggle : false,
		hover : false
	});
	_map.addControl(sfL2);

	var sketchSymbolizers = {
		"Point" : {
			pointRadius : 4,
			graphicName : "square",
			fillColor : "white",
			fillOpacity : 1,
			strokeWidth : 1,
			strokeOpacity : 1,
			strokeColor : "#333333"
		},
		"Line" : {
			strokeWidth : 1,
			strokeOpacity : 0.5,
			// strokeColor: "#666666",
			strokeDashstyle : "solid",
			strokeColor : "#FF0000"
		},
		"Polygon" : {
			strokeWidth : 1,
			strokeOpacity : 0.5,
			strokeColor : "#FF0000",
			fillColor : "white",
			fillOpacity : 0.3
		}
	};
	var style = new OpenLayers.Style();
	style.addRules([
		new OpenLayers.Rule({
			symbolizer : sketchSymbolizers
		})
	]);
	var styleMap = new OpenLayers.StyleMap({
		"default" : style
	});
	measureControls = {
		line : new OpenLayers.Control.Measure(OpenLayers.Handler.Path, {
			persist : true,
			partialDelay : 300,
			handlerOptions : {
				interval : 250,
				layerOptions : {
					styleMap : styleMap
				}
			}
		}),
		polygon : new OpenLayers.Control.Measure(OpenLayers.Handler.Polygon, {
			persist : true,
			handlerOptions : {
				interval : 250,
				layerOptions : {
					styleMap : styleMap
				}
			}
		})
	};

	// var control;
	for ( var key in measureControls) {
		measureControls[key].events.on({
			"measure" : handleMeasurements,
			"measurepartial" : handlePartialMeasurements
		});
		_map.addControl(measureControls[key]);
	}

	// 지도위치이동
	Gis.MapToolbar.init();
}

function getPanZoomBarId() {
	var rtn = "";

	for ( var i in _map.controls) {
		/* controls에 담긴 panzoombar의 classname을 찾는다. */
		if (_map.controls[i].CLASS_NAME == "OpenLayers.Control.PanZoomBarA") {
			rtn = _map.controls[i].id;
		}
	}
	return rtn;
}

var _homeLonLat = null;
function handleClick(evt) {

	_homeLonLat = _map.getLonLatFromPixel(evt.xy);

	pointLayer.removeFeatures(pointLayer.getFeaturesByAttribute("cls", "homeFeature"));
	var homeFeature = new OpenLayers.Feature.Vector(new OpenLayers.Geometry.Point(_homeLonLat.lon, _homeLonLat.lat), {
		"cls" : "homeFeature"
	}, {
		externalGraphic : contextRoot + "/images/gis/marker_blue.png",
		graphicWidth : 40,
		graphicHeight : 40
	});

	pointLayer.addFeatures([
		homeFeature
	]);

	resLonLat(homeFeature);
}

function drawFeatureFromLonlat(pX, pY) {
	pointLayer.removeFeatures(pointLayer.getFeaturesByAttribute("cls", "homeFeature"));

	var _homePixel = new OpenLayers.Pixel(pX, pY);
	var attribute = {
		"cls" : "homeFeature"
	};
	var style = {
		externalGraphic : contextRoot + "/images/gis/marker_blue.png",
		graphicWidth : 40,
		graphicHeight : 40
	};
	var homeFeature = new OpenLayers.Feature.Vector(new OpenLayers.Geometry.Point(_homePixel.x, _homePixel.y), attribute, style);
	pointLayer.addFeatures([
		homeFeature
	]);

}

function arerCmInfoLonlat(num, pX, pY) {
	var _homePixel = new OpenLayers.Pixel(pX, pY);
	var attribute = {
		"cls" : "arerFeature" + num
	};
	var style = {
		externalGraphic : contextRoot + "/images/gis/" + num + ".gif",
		pointRadius : 4,
		graphicXOffset : 10,
		graphicYOffset : -20,
		graphicWidth : 16,
		graphicHeight : 16
	};
	var homeFeature = new OpenLayers.Feature.Vector(new OpenLayers.Geometry.Point(_homePixel.x, _homePixel.y), attribute, style);
	pointLayer.addFeatures([
		homeFeature
	]);
}