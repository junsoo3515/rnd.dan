var _map = null;
var _zoom = null;
var _extent = null;
var _boundsWgs84 = null;
var _bounds = null;


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

var tmLayer = null;
var cadastralLayer = null;

function mapInit(div) {

	OpenLayers.IMAGE_RELOAD_ATTEMPTS = 2;
	OpenLayers.DOTS_PER_INCH = 96;
	OpenLayers.Util.onImageLoadErrorColor = "transparent";
	
	_bounds = new OpenLayers.Bounds(Number(gisBoundsLeft), Number(gisBoundsBottom), Number(gisBoundsRight), Number(gisBoundsTop));
	_bounds.transform(new OpenLayers.Projection("WGS84"), new OpenLayers.Projection(gisProjection));
	_boundsWgs84 = new OpenLayers.Bounds(Number(gisBoundsLeft), Number(gisBoundsBottom), Number(gisBoundsRight), Number(gisBoundsTop));

	_map = new OpenLayers.Map(div, {
		div : div,
		theme : null,
		maxExtent : _bounds, // 지도가 표시될 최대영역 설정
		restrictedExtent : _bounds,
		tileSize : new OpenLayers.Size(256, 256),
		buffer : 1,
		numZoomLevels : 7,
		minResolution : 0.5,
		maxResolution : 32,
		controls : [], // Control 초기화
		projection : new OpenLayers.Projection("EPSG:5179"),
		units : "m",
		eventListeners : {
			"zoomend" : zoomAction,
			"movestart" : moveStartAction,
			"moveend" : moveEndAction
		}
	});

	baseLayer = new TileMapBase();
	baseLayer.setIsBaseLayer(true);
	
	aerialLayer = new AirMapBase();
	aerialLayer.setIsBaseLayer(true);
	
	// 소통정보
	tmLayer = new OpenLayers.Layer.WMS('tmLayer', gisUrlUti, {
		layers : 'doan_link',
		format : "image/png",
		transparent : 'TRUE',
		exceptions : 'BLANK',
		label : 'HIDE_OVERLAP',
		graphic_buffer : '64',
		anti : "TRUE",
		text_anti : "TRUE",
		version : "1.3.0"
	}, {
		buffer : 0,
		singleTile : false
	});
	tmLayer.setVisibility(false);
	
	cadastralLayer = new OpenLayers.Layer.Vector('cadastralLayer', {
		rendererOptions : {
			zIndexing : true
		}
	});

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
			baseLayer, aerialLayer, vectorLayer, pointLayer, tmLayer, cadastralLayer, featureselectedLayer, lprLayer
	]);

	// Controls Add
	// _map.addControl(new OpenLayers.Control.Attribution());
	// _map.addControl(new OpenLayers.Control.MousePosition());
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