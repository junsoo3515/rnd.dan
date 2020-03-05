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
var aerialLayer = null;
var vectorLayer = null;

function mapInit(div) {

	OpenLayers.IMAGE_RELOAD_ATTEMPTS = 1;

	OpenLayers.DOTS_PER_INCH = 96;

	_map = new OpenLayers.Map(div, {
		div : div,
		theme : null,
		maxExtent : new OpenLayers.Bounds(90112, 1192896, 1990673, 2761664),
		restrictedExtent : new OpenLayers.Bounds(974510, 1795754, 1006958, 1834503),
		tileSize : new OpenLayers.Size(256, 256),
		buffer : 1,
		numZoomLevels : 13,
		minResolution : 0.25,
		maxResolution : 1024,
		controls : [], // Control 초기화
		projection : new OpenLayers.Projection("EPSG:5179"),
		units : "m",
		eventListeners : {
			"zoomend" : zoomAction,
			"movestart" : moveStartAction,
			"moveend" : moveEndAction
		}
	});

	baseLayer = new OpenLayers.Layer.Naver(); // new TileMapBase();
	aerialLayer = new OpenLayers.Layer.Naver.Aerial(); // new AirMapBase(); //
	baseLayer.setIsBaseLayer(true);
	aerialLayer.setIsBaseLayer(true);

	vectorLayer = new OpenLayers.Layer.Vector("Vector Layer", {
		styleMap : new OpenLayers.Style({
			strokeColor : "#DDDDDD",
			strokeWidth : 2,
			fillColor : "#CCCCCC",
			fillOpacity : 0.2,
			fontColor : "#333333"
		})
	});

	// Layers Add
	_map.addLayers([
			baseLayer, aerialLayer, vectorLayer
	]);

	// Controls Add
	_map.addControl(new OpenLayers.Control.Attribution());
	_map.addControl(new OpenLayers.Control.MousePosition());

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
		externalGraphic : contextRoot + "/images/mntr/gis/marker_blue.png",
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
		externalGraphic : contextRoot + "/images/mntr/gis/marker_blue.png",
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
		"cls" : "arerFeature"
	};
	var style = {
		externalGraphic : contextRoot + "/images/mntr/gis/" + num + ".gif",
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