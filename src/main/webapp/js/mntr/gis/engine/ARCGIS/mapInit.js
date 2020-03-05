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
var lprLayer = null;

function mapInit(div) {

	Gis.stDefs = {
		"pradius" : {
			"0.06614596562526459" : 15,
			"0.13229193125052918" : 15,
			"0.26458386250105836" : 15,
			"0.6614596562526459" : 15,
			"1.3229193125052918" : 15,
			"2.6458386250105836" : 15,
			"6.614596562526459" : 10,
			"13.229193125052918" : 10,
			"26.458386250105836" : 10,
			"66.1459656252646" : 10,
			"68.79180425027518" : 5
		},
		"yoff" : {
			"0.06614596562526459" : 12,
			"0.13229193125052918" : 12,
			"0.26458386250105836" : 12,
			"0.6614596562526459" : 12,
			"1.3229193125052918" : 12,
			"2.6458386250105836" : 12,
			"6.614596562526459" : 10,
			"13.229193125052918" : 10,
			"26.458386250105836" : 10,
			"66.1459656252646" : 10,
			"68.79180425027518" : 5
		}
	};

	OpenLayers.Layer.ArcGISCache.prototype.getURL = function(bounds) {
		var res = this.getResolution();

		// tile center
		var originTileX = (this.tileOrigin.lon + (res * this.tileSize.w / 2));
		var originTileY = (this.tileOrigin.lat - (res * this.tileSize.h / 2));

		var center = bounds.getCenterLonLat();
		var point = {
			x : center.lon,
			y : center.lat
		};
		var x = (Math.round(Math.abs((center.lon - originTileX) / (res * this.tileSize.w))));
		var y = (Math.round(Math.abs((originTileY - center.lat) / (res * this.tileSize.h))));
		var z = this.map.getZoom();

		// this prevents us from getting pink tiles (non-existant tiles)
		if (this.lods) {
			var lod = this.lods[this.map.getZoom()];
			if ((x < lod.startTileCol || x > lod.endTileCol) || (y < lod.startTileRow || y > lod.endTileRow)) {
				return null;
			}
		}
		else {
			var start = this.getUpperLeftTileCoord(res);
			var end = this.getLowerRightTileCoord(res);
			if ((x < start.x || x >= end.x) || (y < start.y || y >= end.y)) {
				return null;
			}
		}

		// Construct the url string
		var url = this.url;
		var s = '' + x + y + z;

		if (OpenLayers.Util.isArray(url)) {
			url = this.selectUrl(s, url);
		}

		// Accessing tiles through ArcGIS Server uses a different path
		// structure than direct access via the folder structure.
		if (this.useArcGISServer) {
			// AGS MapServers have pretty url access to tiles
			url = url + '/tile/${z}/${y}/${x}';
		}
		else {
			// The tile images are stored using hex values on disk.
			x = 'C' + OpenLayers.Number.zeroPad(x, 8, 16);
			y = 'R' + OpenLayers.Number.zeroPad(y, 8, 16);
			z = 'L' + OpenLayers.Number.zeroPad(z, 2, this.hexZoom ? 16 : 10);
			url = url + '/${z}/${y}/${x}.' + this.type;
		}

		// Write the values into our formatted url
		url = OpenLayers.String.format(url, {
			'x' : x,
			'y' : y,
			'z' : z + 2
		});
		
		return OpenLayers.Util.urlAppend(url, OpenLayers.Util.getParameterString(this.params));
	}

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
		// numZoomLevels : 11, // ZoomLevel의 수
		maxResolution : 26.458386250105836,
		minResolution : 0.06614596562526459,
		// controls: [], //Control 초기화
		resolutions : [
			//	68.79180425027518, 
			//	66.1459656252646, 
				26.458386250105836, 
				13.229193125052918, 
				6.614596562526459, 
				2.6458386250105836, 
				1.3229193125052918, 
				0.6614596562526459,
				0.26458386250105836, 
				0.13229193125052918, 
				0.06614596562526459
		],
		projection : new OpenLayers.Projection(gisProjection),
		units : "m",
		eventListeners : {
			"zoomend" : zoomAction,
			"movestart" : moveStartAction,
			"moveend" : moveEndAction
		}
	});

	baseLayer = new OpenLayers.Layer.ArcGISCache('baseLayer', gisUrlBase, {
		tileOrigin : new OpenLayers.LonLat(-5423200.0, 6394600.0),
		tileSize : new OpenLayers.Size(256, 256),
		maxExtent : _bounds,
		projection : new OpenLayers.Projection(gisProjection),
		sphericalMercator : true,
		useArcGISServer : true,
		isBaseLayer : true,
		type : 'png',
		resolutions : [
				/* 68.79180425027518, 66.1459656252646, */ 26.458386250105836, 13.229193125052918, 6.614596562526459, 2.6458386250105836, 1.3229193125052918, 0.6614596562526459,
				0.26458386250105836, 0.13229193125052918, 0.06614596562526459
		]
	}, {
		buffer : 0,
		singleTile : false
	});
	baseLayer.setIsBaseLayer(true);

	aerialLayer = new OpenLayers.Layer.ArcGISCache('aerialLayer', gisUrlAerial, {
		tileOrigin : new OpenLayers.LonLat(-5423200.0, 6394600.0),
		tileSize : new OpenLayers.Size(256, 256),
		maxExtent : _bounds,
		projection : new OpenLayers.Projection(gisProjection),
		sphericalMercator : true,
		useArcGISServer : true,
		isBaseLayer : true,
		type : 'png',
		resolutions : [
				/* 68.79180425027518, 66.1459656252646, */ 26.458386250105836, 13.229193125052918, 6.614596562526459, 2.6458386250105836, 1.3229193125052918, 0.6614596562526459,
				0.26458386250105836, 0.13229193125052918, 0.06614596562526459
		]
	}, {
		buffer : 0,
		singleTile : false
	});
	aerialLayer.setIsBaseLayer(true);

	// CCTV 정보 레이어
	cctvInfoLayer = new OpenLayers.Layer.Vector("cctvInfoLayer", {
		projection : new OpenLayers.Projection(gisProjection),
		strategies : [
				new OpenLayers.Strategy.BBOX({
					resFactor : 1
				}), new OpenLayers.Strategy.Cluster({
					distance : 40
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
		projection : new OpenLayers.Projection(gisProjection),
		styleMap : new OpenLayers.Style({
			strokeColor : "#DDDDDD",
			strokeWidth : 2,
			fillColor : "#CCCCCC",
			fillOpacity : 0.2,
			fontColor : "#333333"
		})
	});

	pointLayer = new OpenLayers.Layer.Vector("pointLayer", {
		projection : new OpenLayers.Projection(gisProjection),
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
	lprLayer.setVisibility(true);

	// Layers Add
	_map.addLayers([
			baseLayer, aerialLayer, cctvInfoLayer, vectorLayer, pointLayer, featureselectedLayer, lprLayer
	]);

	// Controls Add
	// _map.addControl(new OpenLayers.Control.Attribution());
	// _map.addControl(new OpenLayers.Control.MousePosition());
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
		"cls" : "arerFeature"
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

function getJibunAddr(lonlat, url, div) {
	var params = {
		where : '',
		text : '',
		objectIds : '',
		time : '',
		geometry : lonlat.lon + ', ' + lonlat.lat,
		geometryType : 'esriGeometryPoint',
		inSR : '',
		spatialRel : 'esriSpatialRelIntersects',
		relationParam : '',
		outFields : '*',
		returnGeometry : true,
		returnTrueCurves : false,
		maxAllowableOffset : '',
		geometryPrecision : '',
		outSR : '',
		returnIdsOnly : false,
		returnCountOnly : false,
		orderByFields : '',
		groupByFieldsForStatistics : '',
		outStatistics : '',
		returnZ : false,
		returnM : false,
		gdbVersion : '',
		returnDistinctValues : false,
		resultOffset : '',
		resultRecordCount : '',
		f : 'pjson'
	}

	$.ajax({
		type : 'POST',
		async : false,
		dataType : 'jsonp',
		// url : 'http://gis.sun.go.kr/map/rest/services/GYUIS/ParcelDynamic/MapServer/0/query?',
		url : url,
		data : params,
		success : function(result) {
			if (result.features.length != 0) {
				var attributes = result.features[0].attributes;
				var geometry = result.features[0].geometry;
				var pnu = attributes.PNU;
				var lgDongCd = pnu.substring(0, 10);
				$.post(contextRoot + '/mntr/getUmdLi.json', {
					emdCd : lgDongCd
				}, function(data) {
					var lgEmdCd = lgDongCd.substring(5, 8);
					var lgLiCd = lgDongCd.substring(8, 10);
					var lgEmdLi = data.list[0];
					var mountain = (pnu.substring(10, 11) == '2') ? ' 산 ' : ''
					var jibunMain = Number(pnu.substring(11, 15));
					var jibunSub = Number(pnu.substring(15, 19));
					var jibun = lgEmdLi.lgEmdNm + ' ';
					jibun += (lgEmdLi.lgLiNm) ? lgEmdLi.lgLiNm : '' + ' ';
					jibun += mountain;
					jibun += jibunMain;
					jibun += (jibunSub) ? '-' + jibunSub : '';
					if($(div).is('input')) {
						$(div).val(jibun);
					}
					else {
						$(div).text(jibun);
					}
				});
			}
		},
		error : function(data, status, err) {
			console.log(data);
		}
	});
}

function getRoadAddr(lonlat, url, div) {
	var params = {
		where : '',
		text : '',
		objectIds : '',
		time : '',
		geometry : lonlat.lon + ', ' + lonlat.lat,
		geometryType : 'esriGeometryPoint',
		inSR : '',
		spatialRel : 'esriSpatialRelIntersects',
		relationParam : '',
    	// outFields : 'GYUIS.TL_SPRD_MANAGE.RN, GYUIS.TL_SPBD_BULD.BULD_MNNM, GYUIS.TL_SPBD_BULD.BULD_SE_CD',
		outFields : 'TL_SPRD_MANAGE.RN, TL_SPBD_BULD.BULD_MNNM, TL_SPBD_BULD.BULD_SE_CD',
		returnGeometry : true,
		returnTrueCurves : false,
		maxAllowableOffset : '',
		geometryPrecision : '',
		outSR : '',
		returnIdsOnly : false,
		returnCountOnly : false,
		orderByFields : '',
		groupByFieldsForStatistics : '',
		outStatistics : '',
		returnZ : false,
		returnM : false,
		gdbVersion : '',
		returnDistinctValues : false,
		resultOffset : '',
		resultRecordCount : '',
		f : 'pjson'
	}

	$.ajax({
		type : 'POST',
		async : false,
		dataType : 'jsonp',
		// url : 'http://gis.sun.go.kr/map/rest/services/GYUIS/NewAddressDynamic/MapServer/3/query?',
		url : url,
		data : params,
		success : function(result) {
			if (result.features.length > 0) {
				var features = result.features[0];
				var attributes = features.attributes;
				// var roadNm = attributes['GYUIS.TL_SPRD_MANAGE.RN'];
				// var roadMain = attributes['GYUIS.TL_SPBD_BULD.BULD_MNNM'];
				// var roadSub = attributes['GYUIS.TL_SPBD_BULD.BULD_SE_CD'];
				var roadNm = attributes['TL_SPRD_MANAGE.RN'];
				var roadMain = attributes['TL_SPBD_BULD.BULD_MNNM'];
				var roadSub = attributes['TL_SPBD_BULD.BULD_SE_CD'];
				var road = roadNm + ' ';
				road += roadMain;
				road += (roadSub == '0') ? '' : '-' + roadSub;
				if($(div).is('input')) {
					$(div).val(road);
				}
				else {
					$(div).text(road);
				}
			}
		},
		error : function(data, status, err) {
			console.log(data);
		}
	});
}
