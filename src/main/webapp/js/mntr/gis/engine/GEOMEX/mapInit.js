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
var cctvInfoLayer = null;

var vectorLayer = null;
var pointLayer = null;
var featureselectedLayer = null;

var tmLayer = null;
var lprLayer = null;
var undGrndNetLayer = null;
var undGrndDrpLayer = null;
var undGrndWwpLayer = null;
//var layerParams = 'kras_cbnd_as,kais_emd_as,kais_rw_as,kais_manage_ls,kais_eqb_as,kais_buld_as,kais_sig_as';
var layerParams = 'kais_sig_as,kais_emd_as,kais_river_as,kais_park_as,kais_eqb_as,'+
					'kais_rw_as,kais_tunnel_as,kais_bridge_as,kais_manage_ls,'+
					'kais_railway_ls,kais_rlrsta_as,kais_buld_as,its_link_ls';


//지오멕스
function mapInit(div) {
	Gis.stDefs = {
			"pradius" : {
				"0.2982478942162188" : 15,
				"0.5964957884324376" : 15,
				"1.1929915768648751" : 15,
				"2.3859831537297502" : 15,
				"4.7719663074595005" : 10,
				"9.543932614919001" : 10,
				"19.087865229838002" : 10,
				"38.175730459676004" : 10,
				"76.35146091935201" : 5
			},
			"yoff" : {
				"0.2982478942162188" : 12,
				"0.5964957884324376" : 12,
				"1.1929915768648751" : 12,
				"2.3859831537297502" : 12,
				"4.7719663074595005" : 10,
				"9.543932614919001" : 10,
				"19.087865229838002" : 10,
				"38.175730459676004" : 10,
				"76.35146091935201" : 5
			}
		};
	
	OpenLayers.IMAGE_RELOAD_ATTEMPTS = 2;
	OpenLayers.DOTS_PER_INCH = 96;
	OpenLayers.Util.onImageLoadErrorColor = "transparent";
	
	_bounds = new OpenLayers.Bounds(Number(gisBoundsLeft), Number(gisBoundsBottom), Number(gisBoundsRight), Number(gisBoundsTop));
	_bounds.transform(new OpenLayers.Projection("WGS84"), new OpenLayers.Projection(gisProjection));
	_boundsWgs84 = new OpenLayers.Bounds(Number(gisBoundsLeft), Number(gisBoundsBottom), Number(gisBoundsRight), Number(gisBoundsTop));

//	console.log(gisBoundsLeft);
//	console.log(gisBoundsBottom);
//	console.log(gisBoundsRight);
//	console.log(gisBoundsTop);
//	console.log(_bounds);
//	console.log(_boundsWgs84);
	
	_map = new OpenLayers.Map(div, {
		div : div,
		theme : null,
		maxExtent : _bounds, // 지도가 표시될 최대영역 설정
		restrictedExtent : _bounds, // 지도가 표시될 최대영역 설정
		tileSize : new OpenLayers.Size(256, 256),
		numZoomLevels : 9, // ZoomLevel의 수
		maxResolution : 76.35146091935201,
		minResolution : 0.2982478942162188,
		controls : [], // Control 초기화
		resolutions : [
			76.35146091935201,  
			38.175730459676004, 
			19.087865229838002,
			9.543932614919001, 
			4.7719663074595005, 
			2.3859831537297502, 
			1.1929915768648751, 
			0.5964957884324376, 
			0.2982478942162188 
		],
		projection : new OpenLayers.Projection(gisProjection),
		units : "m",
		eventListeners : {
			"zoomend" : zoomAction,
			"movestart" : moveStartAction,
			"moveend" : moveEndAction
		}
	});
	// 기본도
	baseLayer = new OpenLayers.Layer.WMS('baseLayer', gisUrlBase + '/wms?', {
		layers : layerParams,
		transparent : 'TRUE',
		format : 'image/png',
		version : '1.3.0'
	}, {
		isBaseLayer : true,
		buffer : 0,
		singleTile : false
	});
	baseLayer.setIsBaseLayer(true);

	// CCTV 정보 레이어
	cctvInfoLayer = new OpenLayers.Layer.Vector("cctvInfoLayer", {
		renderers: ['Canvas', 'SVG', 'VML'],
		strategies : [
				new OpenLayers.Strategy.BBOX({
					resFactor : 1
				}), new OpenLayers.Strategy.Cluster({
					distance : 20
				})
		],
		protocol : new OpenLayers.Protocol.HTTP({
			url : contextRoot + "/fcltLocData.json",
			params : {
				searchFcltKndCd : '',
				searchFcltUsedType : '',
				searchFcltSttus : '',
				searchFcltId : '',
				searchPlcPtrDiv : '',
				searchIncludeMissingPlcPtrDiv : ''
			},
			readWithPOST : true,
			format : new OpenLayers.Format.GeoJSON()
		}),
		styleMap : new OpenLayers.StyleMap(Gis.cctvInfoLayerStyle)
	});
	cctvInfoLayer.setVisibility(false);

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
		projection : new OpenLayers.Projection(gisProjection),
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
			baseLayer, cctvInfoLayer, vectorLayer, pointLayer, featureselectedLayer, lprLayer
	]);

	// Controls Add
	//_map.addControl(new OpenLayers.Control.Attribution());
	//_map.addControl(new OpenLayers.Control.MousePosition());
	_map.addControl(new OpenLayers.Control.PanZoomBarA());

	sfL2 = new OpenLayers.Control.SelectFeature([
			cctvInfoLayer, vectorLayer
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
