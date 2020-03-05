function mapPan() {
	deactivateControls();
	PAGES.mode = "pan";
	controlGroup.pantool.activate();
}

function mapZoomIn() {
	deactivateControls();
	PAGES.mode = "zoomin";
	controlGroup.zoombox.activate();
}

function mapZoomOut() {
	deactivateControls();
	PAGES.mode = "zoomout";
	controlGroup.zoomboxout.activate();
}

function mapHistPrev() {
	controlGroup.history.previousTrigger();
}

function mapHistNext() {
	controlGroup.history.nextTrigger();
}
function isnull(val) {
	if (val == null || val == '')
		val = "";
	return val;
}

var Gis = {
	ver : "0.2"
};

Gis.stDefs = null;

if(configureUcpId == 'GYC' && gisProjection == 'EPSG:5186') {
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
}
else if(configureUcpId == 'YSC' && gisProjection == 'EPSG:900913') {
	Gis.stDefs = {
			"pradius" : {
				"0.5971642833709717" : 15,
				"1.1943285667419434" : 15,
				"2.388657133483887" : 15,
				"4.777314266967774" : 10,
				"9.554628533935547" : 10,
				"19.109257067871095" : 10,
				"38.21851413574219" : 5,
				"76.43702827148438" : 5
			},
			"yoff" : {
				"0.5971642833709717" : 12,
				"1.1943285667419434" : 12,
				"2.388657133483887" : 12,
				"4.777314266967774" : 10,
				"9.554628533935547" : 10,
				"19.109257067871095" : 10,
				"38.21851413574219" : 5,
				"76.43702827148438" : 5
			}
		};
}
else {
	Gis.stDefs = {
			"pradius" : {
				"0.25" : 15,
				"0.5" : 15,
				"1" : 15,
				"2" : 15,
				"4" : 15,
				"8" : 15,
				"16" : 10,
				"32" : 10,
				"64" : 10,
				"128" : 10,
				"256" : 5,
				"512" : 5,
				"1024" : 5
			},
			"yoff" : {
				"0.25" : 12,
				"0.5" : 12,
				"1" : 12,
				"2" : 12,
				"4" : 12,
				"8" : 12,
				"16" : 10,
				"32" : 10,
				"64" : 10,
				"128" : 10,
				"256" : 5,
				"512" : 5,
				"1024" : 5
			}
		};
}

Gis.fcltLayerStyle = new OpenLayers.Style({
	cursor : "pointer",
	externalGraphic : "${getIcon}",
	pointRadius : "${getPointRadius}",
	graphicXOffset : "${getXOffset}",
	graphicYOffset : "${getYOffset}",
	graphicTitle : "${graphicTitle}",
	graphicWidth : 30,
	graphicHeight : 30
}, {
	context : {
		getIcon : function(f) {
			var typeCd = f.attributes.typeCd;

			var size = configureIconSize;

			var prefix = 'danFclt/';
			var suffix = '.png';


					var feature = new OpenLayers.Feature.Vector(new OpenLayers.Geometry.Point(f.geometry.x, f.geometry.y), { facCd : f.attributes.facCd }, {
						label : "R",
						fontColor : "#f00",
						fontSize : "11px",
						fontWeight : "bold",
						labelAlign : "cb",
						labelYOffset : 13,
						labelOutlineColor : "#fff",
						labelOutlineWidth : 3
					});
					rtCctvLayer.addFeatures([ feature ]);

			var markImage = prefix + typeCd + '_' + size + '_' + size + suffix;

			return getMarkImage(markImage);
		},
		getPointRadius : function(f) {
			var mr = _map.getResolution();
			return Gis.stDefs.pradius[mr.toString()];
		},
		getXOffset : function(f) {
			var mr = _map.getResolution();

			if(isNaN(-Gis.stDefs.pradius[mr.toString()])) {
				return 12;
			}
			else {
				return -Gis.stDefs.pradius[mr.toString()];
			}
		},
		getYOffset : function(f) {
			var mr = _map.getResolution();
			if(isNaN(-Gis.stDefs.yoff[mr.toString()])) {
				return 12;
			}
			else {
				return -Gis.stDefs.yoff[mr.toString()];
			}
		},
		graphicTitle : function(f) {
			var addr = "";
			if (f.attributes.addr)
				addr = f.attributes.addr;
			return addr;
		},
		getLabel : function(f) {
			var facNm = f.attributes.facNm;
			return facNm;
		}
	},
	rules : [
			new OpenLayers.Rule({
				minScaleDenominator : 0,
				maxScaleDenominator : 5000,
				symbolizer : {
					label : "${getLabel}",
					fontColor : "#000000",
					fontSize : "11px",
					fontFamily : "맑은고딕",
					fontWeight : "bold",
					labelAlign : "cb",
					labelYOffset : -21,
					labelOutlineColor : "#FBFAAA",
					labelOutlineWidth : 3
				}
			}), new OpenLayers.Rule({
				minScaleDenominator : 5000
			})
	]
});

//Gis.cctvInfoLayerStyle = new OpenLayers.Style({
//	cursor : "pointer",
//	externalGraphic : "${getIcon}",
//	pointRadius : "${getPointRadius}",
//	graphicXOffset : "${getXOffset}",
//	graphicYOffset : "${getYOffset}",
//	graphicTitle : "${graphicTitle}",
//	graphicWidth : 30,
//	graphicHeight : 30
//}, {
//	context : {
//		getIcon : function(f) {
//			var status = f.attributes.fcltSttus;
//			var fcltUsedTyCd = f.attributes.fcltUsedTyCd;
//			var size = configureIconSize;
//
//			var prefix = 'fclt/';
//			var suffix = '.png';
//
//			// CCTV 고정형 회전형 구분
//			if (f.attributes.fcltKndCd == 'CTV') {
//				var kndDtlCd = f.attributes.fcltKndDtlCd;
//				if (typeof kndDtlCd == 'RT') {
//					suffix = '_RT.png';
//				}
//			}
//
//			if (fcltUsedTyCd == 'TST') {
//				var markImage = 'fclt/TST_0_0.png';
//
//				return getMarkImage(markImage);
//			}
//
//			var markImage = prefix + fcltUsedTyCd + '_' + size + '_' + status + suffix;
//			return getMarkImage(markImage);
//		},
//		getPointRadius : function(f) {
//			var mr = _map.getResolution();
//			return Gis.stDefs.pradius[mr.toString()];
//		},
//		getXOffset : function(f) {
//			var mr = _map.getResolution();
//
//			if(isNaN(-Gis.stDefs.pradius[mr.toString()])) {
//				return 12;
//			}
//			else {
//				return -Gis.stDefs.pradius[mr.toString()];
//			}
//		},
//		getYOffset : function(f) {
//			var mr = _map.getResolution();
//			if(isNaN(-Gis.stDefs.yoff[mr.toString()])) {
//				return 12;
//			}
//			else {
//				return -Gis.stDefs.yoff[mr.toString()];
//			}
//		},
//		graphicTitle : function(f) {
//			var addr = "";
//			if (f.attributes.newAddr)
//				addr = f.attributes.newAddr;
//			return addr;
//		},
//		getLabel : function(f) {
//			var lblNm = f.attributes.cctvNm;
//			return lblNm;
//		}
//	},
//	rules : [
//			new OpenLayers.Rule({
//				minScaleDenominator : 0,
//				maxScaleDenominator : 5000,
//				symbolizer : {
//					label : "${getLabel}",
//					fontColor : "#000000",
//					fontSize : "11px",
//					fontFamily : "맑은고딕",
//					fontWeight : "bold",
//					labelAlign : "cb",
//					labelYOffset : -21,
//					labelOutlineColor : "#FBFAAA",
//					labelOutlineWidth : 3
//				}
//			}), new OpenLayers.Rule({
//				minScaleDenominator : 5000
//			})
//	]
//
//});

Gis.eventLayerStyle = new OpenLayers.Style({
	cursor : "pointer",
	externalGraphic : "${getIcon}",
	pointRadius : "${getPointRadius}",
	graphicXOffset : "${getXOffset}",
	graphicYOffset : "${getYOffset}",
	graphicTitle : "${graphicTitle}",
	graphicWidth : 20,
	graphicHeight : 20
}, {
	context : {
		getIcon : function(f) {
			var prefix = 'event/';
			var suffix = '.png';
			var markImage = prefix + f.attributes.evtId + suffix;
			return getMarkImage(markImage);
		},
		getPointRadius : function(f) {
			var mr = _map.getResolution();
			return Gis.stDefs.pradius[mr.toString()];
		},
		getXOffset : function(f) {
			var mr = _map.getResolution();
			var vLelx = 0;
			vLelx = (Number(f.attributes.lblFclt) - 1) * 15;
			
			if(isNaN(-Gis.stDefs.pradius[mr.toString()])) {
				return 12 + vLelx;
			}
			else {
				return -Gis.stDefs.pradius[mr.toString()] + vLelx;
			}
		},
		getYOffset : function(f) {
			var mr = _map.getResolution();

			if(isNaN(-Gis.stDefs.yoff[mr.toString()])) {
				return 12;
			}
			else {
				return -Gis.stDefs.yoff[mr.toString()];
			}
		},
		graphicTitle : function(f) {
			var addr = "";
			if (f.attributes.roadAdresNm)
				addr = f.attributes.evtNm;
			return addr;
		},
		getLabel : function(f) {
			return f.attributes.evtNm;
		}
	},
	rules : [
			new OpenLayers.Rule({
				minScaleDenominator : 0,
				maxScaleDenominator : 25000,
				symbolizer : {
					label : "${getLabel}",
					fontColor : "#000000",
					fontSize : "9px",
					fontFamily : "맑은고딕",
					fontWeight : "bold",
					labelAlign : "cb",
					labelYOffset : -21,
					labelOutlineColor : "white",
					labelOutlineWidth : 3
				}
			}), new OpenLayers.Rule({
				minScaleDenominator : 25000
			})
	]
});

Gis.bookmarkLayerStyle = new OpenLayers.Style({
	cursor : "pointer" /*
						 * , externalGraphic: "${getIcon}", pointRadius: "${getPointRadius}", graphicWidth: 40, graphicHeight: 40,
						 * graphicXOffset: -20, graphicYOffset: -40
						 */
}, {
	context : {
		/*
		 * getIcon: function(f) { return getMarkImage("bookmark_blue.png") ; }, getPointRadius: function(f) { var mr = _map.getResolution();
		 * return Gis.stDefs.pradius[mr.toString()]; }, getXOffset: function(f) { var mr = _map.getResolution(); return
		 * -Gis.stDefs.pradius[mr.toString()]; }, getYOffset: function(f) { var mr = _map.getResolution(); return
		 * -Gis.stDefs.yoff[mr.toString()]; },
		 */
		getLabel : function(f) {
			return f.attributes.bookmarkNm;
		}
	},
	rules : [
			new OpenLayers.Rule({
				minScaleDenominator : 0,
				maxScaleDenominator : 40000,
				symbolizer : {
					label : "${getLabel}",
					fontColor : "#000000",
					fontSize : "11px",
					fontFamily : "돋움",
					fontWeight : "bold",
					labelAlign : "cb",
					// labelYOffset: -9,
					labelOutlineColor : "orange",
					labelOutlineWidth : 3
				}
			}), new OpenLayers.Rule({
				minScaleDenominator : 40000
			})
	]

});

var itrtCarLayerStyle = new OpenLayers.Style({
	cursor : "pointer",
	externalGraphic : "${getIcon}",
	pointRadius : "${getPointRadius}",
	graphicXOffset : "${getXOffset}",
	graphicYOffset : "${getYOffset}",
	graphicTitle : "${graphicTitle}"
}, {
	context : {
		getIcon : function(f) {
			return getMarkImage("number/number_" + f.attributes.rnum + ".png");
		},
		getPointRadius : function(f) {
			var mr = _map.getResolution();
			return Gis.stDefs.pradius[mr.toString()];
		},
		getXOffset : function(f) {
			var mr = _map.getResolution();
			return -Gis.stDefs.pradius[mr.toString()];
		},
		getYOffset : function(f) {
			var mr = _map.getResolution();
			return -Gis.stDefs.yoff[mr.toString()];
		},
		graphicTitle : function(f) {
			var ocrLoc = '';
			if (f.attributes.roadAdresNm)
				ocrLoc = f.attributes.roadAdresNm;
			return ocrLoc;
		},
		getLabel : function(f) {
			return f.attributes.fcltLblNm;
		}

	},
	rules : [
			new OpenLayers.Rule({
				minScaleDenominator : 0,
				maxScaleDenominator : 25000,
				symbolizer : {
					label : "${getLabel}",
					fontColor : "#000000",
					fontSize : "12px",
					fontFamily : "돋움",
					fontWeight : "bold",
					labelAlign : "cb",
					labelYOffset : -25,
					labelOutlineColor : "white",
					labelOutlineWidth : 3
				}
			}), new OpenLayers.Rule({
				minScaleDenominator : 25000
			})
	]

});


function getMarkImage(imgNm) {
	return contextRoot + "/images/mntr/gis/" + imgNm;
}


function fcltLayerRefresh(searchDstrtCd, searchExcludeDanFcltType) {
	console.log('fcltLayerRefresh');
	fcltLayer.protocol.params.searchDstrtCd = searchDstrtCd;
	fcltLayer.protocol.params.searchExcludeDanFcltType = searchExcludeDanFcltType;
	fcltLayer.refresh({
		force : true,
		params : {
			searchDstrtCd : configureDstrtCd,
			searchExcludeDanFcltType : searchExcludeDanFcltType
		}
	});
	fcltLayer.redraw();
	rtCctvLayer.removeAllFeatures();
	lprLayer.removeAllFeatures();
}



OpenLayers.Control.Clicker = OpenLayers.Class(OpenLayers.Control, {
	defaultHandlerOptions : {
		"single" : true
	},

	callbackfunc : function() {
	},

	initialize : function(options) {
		this.handlerOptions = OpenLayers.Util.extend({}, this.defaultHandlerOptions);
		OpenLayers.Control.prototype.initialize.apply(this, arguments);
		this.handler = new OpenLayers.Handler.Click(this, {
			"click" : this.onClick
		}, this.handlerOptions);
	},

	onClick : function(evt) {
		this.lonlat = this.map.getLonLatFromPixel(evt.xy);
		this.callbackfunc(evt);
	}
});

function handleMeasurements(event) {
	var geometry = event.geometry;
	var units = event.units;
	var order = event.order;
	var measure = event.measure;
	var unitText = "";
	var gPosition = null;
	var mapRex = _map.getResolution();

	if (order == 1) {
		unitText = units;
	}
	else {
		if (units == "m") {
			unitText = "㎡";
		}
		else {
			unitText = "㎢";
		}
	}
	var pLabel = measure.toFixed(1) + " " + unitText;
	// var measurePop = null;
	if (order == 1) {
		var gcLength = geometry.components.length;
		var x = geometry.components[gcLength - 1].x + 3 * mapRex;
		var y = geometry.components[gcLength - 1].y - 3 * mapRex;

		gPosition = new OpenLayers.LonLat(x, y);
	}
	else {
		gPosition = geometry.getBounds().getCenterLonLat();
	}

	vectorLayer.addFeatures([
			new OpenLayers.Feature.Vector(new OpenLayers.Geometry.Point(gPosition.lon, gPosition.lat), {
				"cls" : "measurePoint"
			}, {
				pointRadius : (order == 1) ? 4 : 0,
				graphicName : "circle",
				fillColor : "#0000FF",
				fillOpacity : 1,
				strokeColor : "#0000FF",
				strokeOpacity : 1,
				strokeWidth : 1,
				label : pLabel,
				fontColor : "#000000",
				fontSize : "11px",
				fontFamily : "돋움",
				fontWeight : "bold",
				labelAlign : "cb",
				labelYOffset : -9,
				labelOutlineColor : "white",
				labelOutlineWidth : 3
			}), new OpenLayers.Feature.Vector(geometry, {
				"cls" : "measureShape"
			}, {
				fillColor : "#EEEEEE",
				fillOpacity : 0.5,
				strokeColor : "#FF0000",
				strokeOpacity : 1,
				strokeWidth : 2
			})
	]);

	partialMeasureCount = 0;

}

var partialMeasureValue = 0;
var partialMeasureUnit = "m";

function handlePartialMeasurements(event) {
	var geometry = event.geometry;
	var units = event.units;
	if (partialMeasureUnit != units) {
		partialMeasureValue /= 1000;
	}
	var order = event.order;
	var measure = event.measure;
	var pLabel = "";

	var vPosition = null;
	var mapRex = _map.getResolution();
	if (order == 1) {
		var gcLength = geometry.components.length;
		var x = geometry.components[gcLength - 1].x + 3 * mapRex;
		var y = geometry.components[gcLength - 1].y - 3 * mapRex;
		gPosition = new OpenLayers.LonLat(x, y);
		vPosition = new OpenLayers.LonLat(geometry.components[gcLength - 1].x, geometry.components[gcLength - 1].y);

		if (partialMeasureCount > 1) {
			pLabel = measure.toFixed(1) + " " + units + "\n" + (measure - partialMeasureValue).toFixed(1) + " " + units;
		}
		else if (partialMeasureCount == 1) {
			pLabel = measure.toFixed(1) + " " + units;
		}

		partialMeasureValue = measure;
		partialMeasureUnit = units;

		if (partialMeasureCount > 0) {
			vectorLayer.addFeatures([
				new OpenLayers.Feature.Vector(new OpenLayers.Geometry.Point(vPosition.lon, vPosition.lat), {
					"cls" : "measurePoint"
				}, {
					pointRadius : 4,
					graphicName : "square",
					fillColor : "white",
					fillOpacity : 1,
					strokeColor : "#FF0000",
					strokeOpacity : 1,
					strokeWidth : 1,
					label : pLabel,
					fontColor : "#000000",
					fontSize : "10px",
					fontFamily : "돋움",
					fontWeight : "bold",
					labelAlign : "cb",
					labelYOffset : -9,
					labelOutlineColor : "white",
					labelOutlineWidth : 3
				})
			]);
		}
		// bnExclusive = false;
	}
	/*
	 * else { if (bnExclusive) clearMeasurePopups(); bnExclusive = false; }
	 */

	partialMeasureCount++;
}

Gis.MapTools = {
	infoPop : null,
	mapToScale : function() {
		_map.zoomToScale(document.getElementById("txtScale").value, true);
		document.getElementById("txtScale").value = "1:" + parseInt(_map.getScale());
	},

	setTextScale : function() {
		document.getElementById("txtScale").value = "1:" + parseInt(_map.getScale());
	},

	switchBaseLayer : function(selparam) {
		var domObj = selparam;
		switch (domObj.id) {
			case "baseToggle1":
				_map.setBaseLayer(baseLayer);
				aerialLayer.setVisibility(false);
				overlayer.setVisibility(false);

				// setScaleLineStyle("color_1");
				break;
			case "baseToggle2":
				_map.setBaseLayer(aerialLayer);
				overlayer.setVisibility(true);
				baseLayer.setVisibility(false);
				// setScaleLineStyle("color_2");
				break;
		}
	},

	openPopup : function(pos, html, popSize, closeCallback) {
		if(typeof closeCallback == 'undefined') {
			this.infoPop = new OpenLayers.Popup.FramedCloud("infoPop", pos, popSize, html, null, true, this.clearPopups);
			if(popSize) this.infoPop.autoSize = false;
		}
		else {
			this.infoPop = new OpenLayers.Popup.FramedCloud("infoPop", pos, popSize, html, null, true, closeCallback);
			if(popSize) this.infoPop.autoSize = false;
		}
		this.clearPopups();
		_map.addPopup(this.infoPop, false);
	},

	clearPopups : function(isNotClick) {
		try {
			for (var i = _map.popups.length - 1; i >= 0; --i) {
				if (_map.popups[i].id.indexOf("statusPop") < 0) {
					_map.removePopup(_map.popups[i]);
				}
			}
		}
		catch (e) {
		}

	},

	getAddr : function(lonlat, addr, newAddr) {
		if(configureUcpId == 'NJC') {
			var filterText = "<Filter><Contains><PropertyName>SHAPE</PropertyName><Point srsName=\"EPSG:5179\"><pos>" + lonlat.lon + " " + lonlat.lat
					+ "</pos></Point></Contains></Filter>";
			wfsPostQuery(contextRoot + "/proxy?url=", gisUrl + "/wfs", "GDX=njuct_lp_pa_cbnd.xml&", "NJGIS.VL_LP_PA_CBND", filterText, function(response) {
				Gis.MapTools.getAddrReturn(response, addr, newAddr);
			}, true);
		}	
		else if(configureUcpId == 'DJD') {
			//여기부분에 추가 해주시면 됩니다.
			var filterText = "<Filter><Contains><PropertyName>THE_GEOM</PropertyName><Point srsName=\"EPSG:5179\"><pos>" + lonlat.lon + " " + lonlat.lat
				+ "</pos></Point></Contains></Filter>";
			wfsQuery(contextRoot + "/proxy?url=", gisUrlWfs, "", "LP_PA_CBND", filterText, null, function(response) {
				Gis.MapTools.getAddrReturn(response, addr, newAddr);
			});
			/*wfsPostQuery(contextRoot + "/proxy?url=", gisUrlWfs , "&", "LP_PA_CBND", filterText, function(response) {
				Gis.MapTools.getAddrReturn(response, addr, newAddr);
			}, true);*/
			
		}	
		else if(configureUcpId == 'KSG') {
			
			 jQuery.ajax({
                 type: "GET",
                 url: contextRoot + "/proxy?url="
                           + escape(gisUrl + "/qapi?REQUEST=getAddr&PARAM1=POINT(" + lonlat.lon + "%20" + lonlat.lat + ")&SRSNAME=EPSG:5179&OUTPUTFORMAT=application%2Fjson%3B%20subtype%3Dgeojson"),
                 dataType: "JSON",
                 success : function (data) {
                	 	   var oaddr = "";
                           var naddr = "";
                           if (data.features.length>0) {
                                      oaddr = data.features[0].properties.JADDR;
                                      naddr = data.features[0].properties.RADDR;
                           }
                           
                           if (addr == "popupLotnoAdresNm") {
                        	   $("#" + addr).text(oaddr);
                           }
                           else {
                        	   $("#" + addr).val(oaddr);
                           }
                           
                           if (newAddr == "popupRoadAdresNm") {
                        	   $("#" + addr).text(oaddr);
                           }
                           else {
                        	   $("#" + newAddr).val((naddr&&naddr!="null")?naddr:"");
                           }
                 },
                 complete: function (data) {},
                 error: function(xhr, status, error) {}
			 });

		}	
		
	},

	getAddrReturn : function(response, lotnoAdresNm, roadAdresNm) {
		var g = new OpenLayers.Format.GML();
		var addr = "";
		var naddr = "";
		var features = g.read(response.responseText);
		if (features != null && features.length > 0) {
			addr = features[0].attributes.OLD_ADDR;
			naddr = features[0].attributes.NEW_ADDR;
			pnu = features[0].attributes.PNU;

			if(roadAdresNm == 'popupRoadAdresNm') {
				$("#" + roadAdresNm).text((naddr && naddr != "null") ? naddr : "");
			}
			else {
				$("#" + roadAdresNm).val((naddr && naddr != "null") ? naddr : "");
			}
			
			if(lotnoAdresNm == 'popupLotnoAdresNm') {
				$("#" + lotnoAdresNm).text(addr);
			}
			else {
				$("#" + lotnoAdresNm).val(addr);
			}
		}
	}
};

Gis.MapToolbar = {
	mode : "pan",
	controlGroup : {
		zoomin : new OpenLayers.Control.ZoomBox(),
		zoomout : new OpenLayers.Control.ZoomBox({
			out : true
		}),
		pantool : new OpenLayers.Control.Navigation({
			dragPanOptions : {
				enableKinetic : false
			},
			handleRightClicks : false,
			mouseWheelOptions : {
				interval : 200,
				cumulative : false
			}
		}),
		history : new OpenLayers.Control.NavigationHistory()

	},

	init : function() {
		for ( var key in this.controlGroup) {
			_map.addControl(this.controlGroup[key]);
		}
		// this.controlGroup.selectfeature.activate();
	},

	pan : function() {
		this.deactivateControls();
		this.mode = "pan";
		this.controlGroup.pantool.activate();
	},

	zoomIn : function() {
		this.deactivateControls();
		this.mode = "zoomin";
		this.controlGroup.zoomin.activate();
	},

	zoomOut : function() {
		this.deactivateControls();
		this.mode = "zoomout";
		this.controlGroup.zoomout.activate();
	},

	deactivateControls : function() {
		this.controlGroup.zoomin.deactivate();
		this.controlGroup.zoomout.deactivate();
		measureControls.line.deactivate();
		measureControls.polygon.deactivate();
	},

	prev : function() {
		this.controlGroup.history.previousTrigger();
	},

	next : function() {
		this.controlGroup.history.nextTrigger();
	},

	measureDistance : function() {
		this.deactivateControls();
		measureControls["line"].activate();
	},

	measureArea : function() {
		this.deactivateControls();
		measureControls["polygon"].activate();
	}
};

/*
 * ====================================================================== OpenLayers/Control/PanZoomBar.js
 * ======================================================================
 */

/*
 * Copyright (c) 2006-2013 by OpenLayers Contributors (see authors.txt for full list of contributors). Published under the 2-clause BSD
 * license. See license.txt in the OpenLayers distribution or repository for the full text of the license.
 */

/**
 * @requires OpenLayers/Control/PanZoom.js
 */

/**
 * Class: OpenLayers.Control.PanZoomBar The PanZoomBar is a visible control composed of a <OpenLayers.Control.PanPanel> and a
 * <OpenLayers.Control.ZoomBar>. By default it is displayed in the upper left corner of the map as 4 directional arrows above a vertical
 * slider.
 * 
 * Inherits from: - <OpenLayers.Control.PanZoom>
 */
OpenLayers.Control.PanZoomBarA = OpenLayers.Class(OpenLayers.Control.PanZoomBar, {
	slideRatio : 0.2,
	/**
	 * APIProperty: zoomStopWidth
	 */
	// zoomStopWidth: 18,
	/**
	 * APIProperty: zoomStopHeight
	 */
	// zoomStopHeight: 11,
	/**
	 * Property: slider
	 */
	// slider: null,
	/**
	 * Property: sliderEvents {<OpenLayers.Events>}
	 */
	// sliderEvents: null,
	/**
	 * Property: zoombarDiv {DOMElement}
	 */
	// zoombarDiv: null,
	/**
	 * APIProperty: zoomWorldIcon {Boolean}
	 */
	// zoomWorldIcon: false,
	/**
	 * APIProperty: panIcons {Boolean} Set this property to false not to display the pan icons. If false the zoom world icon is placed under
	 * the zoom bar. Defaults to true.
	 */
	// panIcons: true,
	/**
	 * APIProperty: forceFixedZoomLevel {Boolean} Force a fixed zoom level even though the map has fractionalZoom
	 */
	// forceFixedZoomLevel: false,
	/**
	 * Property: mouseDragStart {<OpenLayers.Pixel>}
	 */
	// mouseDragStart: null,
	/**
	 * Property: deltaY {Number} The cumulative vertical pixel offset during a zoom bar drag.
	 */
	// deltaY: null,
	/**
	 * Property: zoomStart {<OpenLayers.Pixel>}
	 */
	// zoomStart: null,
	/**
	 * Constructor: OpenLayers.Control.PanZoomBar
	 */

	/**
	 * APIMethod: destroy
	 */
	/*
	 * destroy: function() {
	 * 
	 * this._removeZoomBar();
	 * 
	 * this.map.events.un({ "changebaselayer": this.redraw, "updatesize": this.redraw, scope: this });
	 * 
	 * OpenLayers.Control.PanZoom.prototype.destroy.apply(this, arguments);
	 * 
	 * delete this.mouseDragStart; delete this.zoomStart; },
	 */

	/**
	 * Method: setMap
	 * 
	 * Parameters: map - {<OpenLayers.Map>}
	 */
	setMap : function(map) {
		OpenLayers.Control.PanZoom.prototype.setMap.apply(this, arguments);
		this.map.events.on({
			"changebaselayer" : this.redraw,
			"updatesize" : this.redraw,
			scope : this
		});
	},

	/**
	 * Method: redraw clear the div and start over.
	 */
	redraw : function() {
		if (this.div != null) {
			this.removeButtons();
			this._removeZoomBar();
		}
		this.draw();
	},

	/**
	 * Method: draw
	 * 
	 * Parameters: px - {<OpenLayers.Pixel>}
	 */
	draw : function(px) {
		// initialize our internal div
		OpenLayers.Control.prototype.draw.apply(this, arguments);
		px = this.position.clone();

		// place the controls
		this.buttons = [];

		this.div.style.cssText = "right:50px; top:4px; position: absolute; z-index:1003";
		var sz = {
			w : 18,
			h : 18
		};
		var panUpDown = {
			w : 45,
			h : 15
		};
		var panLeftRight = {
			w : 23,
			h : 15
		};

		if (this.panIcons) {
			var centered = new OpenLayers.Pixel(px.x + sz.w / 2, px.y);
			var upDownPosition = new OpenLayers.Pixel(0, 7);
			var leftPosition = new OpenLayers.Pixel(0, 22);
			var wposition = sz.w;

			if (this.zoomWorldIcon) {
				centered = new OpenLayers.Pixel(px.x + sz.w, px.y);
			}

			this._addButton("panup", contextRoot + "/js/mntr/gis/img/north-mini.png", upDownPosition, panUpDown);
			px.y = centered.y + sz.h;
			this._addButton("panleft", contextRoot + "/js/mntr/gis/img/west-mini.png", leftPosition, panLeftRight);

			if (this.zoomWorldIcon) {
				this._addButton("zoomworld", contextRoot + "/js/mntr/gis/img/zoom-world-mini.png", px.add(sz.w, 0), sz);

				wposition *= 2;

			}
			this._addButton("panright", contextRoot + "/js/mntr/gis/img/east-mini.png", px.add(wposition, 0), panLeftRight);
			// this._addButton("pandown", "south-mini.png", test.add(0, sz.h*2), panUpDown);
			this._addButton("pandown", contextRoot + "/js/mntr/gis/img/south-mini.png", upDownPosition.add(0, panUpDown.h * 2), panUpDown);
			this._addButton("zoomin", contextRoot + "/js/mntr/gis/img/zoom-plus-mini.png", centered.add(0, sz.h * 3 + 5), sz);
			centered = this._addZoomBar(centered.add(0, sz.h * 4 + 5));
			this._addButton("zoomout", contextRoot + "/js/mntr/gis/img/zoom-minus-mini.png", centered, sz);
		}
		else {
			this._addButton("zoomin", contextRoot + "/js/mntr/gis/img/zoom-plus-mini.png", px, sz);
			centered = this._addZoomBar(px.add(0, sz.h));
			this._addButton("zoomout", contextRoot + "/js/mntr/gis/img/zoom-minus-mini.png", centered, sz);
			if (this.zoomWorldIcon) {
				centered = centered.add(0, sz.h + 3);
				this._addButton("zoomworld", contextRoot + "/js/mntr/gis/img/zoom-world-mini.png", centered, sz);
			}
		}

		return this.div;
	},

	/**
	 * Method: _addZoomBar
	 * 
	 * Parameters: centered - {<OpenLayers.Pixel>} where zoombar drawing is to start.
	 */
	_addZoomBar : function(centered) {
		var imgLocation = OpenLayers.Util.getImageLocation(contextRoot + "/js/mntr/gis/img/slider.png");
		var id = this.id + "_" + this.map.id;
		var minZoom = this.map.getMinZoom();
		var zoomsToEnd = this.map.getNumZoomLevels() - 1 - this.map.getZoom();
		var slider = OpenLayers.Util.createAlphaImageDiv(id, centered.add(-1, zoomsToEnd * this.zoomStopHeight), {
			w : 20,
			h : 9
		}, imgLocation, "absolute");
		slider.style.cursor = "move";
		this.slider = slider;

		this.sliderEvents = new OpenLayers.Events(this, slider, null, true, {
			includeXY : true
		});
		this.sliderEvents.on({
			"touchstart" : this.zoomBarDown,
			"touchmove" : this.zoomBarDrag,
			"touchend" : this.zoomBarUp,
			"mousedown" : this.zoomBarDown,
			"mousemove" : this.zoomBarDrag,
			"mouseup" : this.zoomBarUp
		});

		var sz = {
			w : this.zoomStopWidth,
			h : this.zoomStopHeight * (this.map.getNumZoomLevels() - minZoom)
		};
		var imgLocation = OpenLayers.Util.getImageLocation(contextRoot + "/js/mntr/gis/img/zoombar.png");
		var div = null;

		if (OpenLayers.Util.alphaHack()) {
			var id = this.id + "_" + this.map.id;
			div = OpenLayers.Util.createAlphaImageDiv(id, centered, {
				w : sz.w,
				h : this.zoomStopHeight
			}, imgLocation, "absolute", null, "crop");
			div.style.height = sz.h + "px";
		}
		else {
			div = OpenLayers.Util.createDiv('OpenLayers_Control_PanZoomBar_Zoombar' + this.map.id, centered, sz, imgLocation);
		}
		div.style.cursor = "pointer";
		div.className = "olButton";
		this.zoombarDiv = div;

		this.div.appendChild(div);

		this.startTop = parseInt(div.style.top);
		this.div.appendChild(slider);

		this.map.events.register("zoomend", this, this.moveZoomBar);

		centered = centered.add(0, this.zoomStopHeight * (this.map.getNumZoomLevels() - minZoom));
		return centered;
	},

	/**
	 * Method: _removeZoomBar
	 */
	_removeZoomBar : function() {
		this.sliderEvents.un({
			"touchstart" : this.zoomBarDown,
			"touchmove" : this.zoomBarDrag,
			"touchend" : this.zoomBarUp,
			"mousedown" : this.zoomBarDown,
			"mousemove" : this.zoomBarDrag,
			"mouseup" : this.zoomBarUp
		});
		this.sliderEvents.destroy();

		this.div.removeChild(this.zoombarDiv);
		this.zoombarDiv = null;
		this.div.removeChild(this.slider);
		this.slider = null;

		this.map.events.unregister("zoomend", this, this.moveZoomBar);
	},

	/**
	 * Method: onButtonClick
	 * 
	 * Parameters: evt - {Event}
	 */
	onButtonClick : function(evt) {
		OpenLayers.Control.PanZoom.prototype.onButtonClick.apply(this, arguments);
		if (evt.buttonElement === this.zoombarDiv) {
			var levels = evt.buttonXY.y / this.zoomStopHeight;
			if (this.forceFixedZoomLevel || !this.map.fractionalZoom) {
				levels = Math.floor(levels);
			}
			var zoom = (this.map.getNumZoomLevels() - 1) - levels;
			zoom = Math.min(Math.max(zoom, 0), this.map.getNumZoomLevels() - 1);
			this.map.zoomTo(zoom);
		}
	},

	/**
	 * Method: passEventToSlider This function is used to pass events that happen on the div, or the map, through to the slider, which then
	 * does its moving thing.
	 * 
	 * Parameters: evt - {<OpenLayers.Event>}
	 */
	passEventToSlider : function(evt) {
		this.sliderEvents.handleBrowserEvent(evt);
	},

	/*
	 * Method: zoomBarDown event listener for clicks on the slider
	 * 
	 * Parameters: evt - {<OpenLayers.Event>}
	 */
	zoomBarDown : function(evt) {
		if (!OpenLayers.Event.isLeftClick(evt) && !OpenLayers.Event.isSingleTouch(evt)) {
			return;
		}
		this.map.events.on({
			"touchmove" : this.passEventToSlider,
			"mousemove" : this.passEventToSlider,
			"mouseup" : this.passEventToSlider,
			scope : this
		});
		this.mouseDragStart = evt.xy.clone();
		this.zoomStart = evt.xy.clone();
		this.div.style.cursor = "move";
		// reset the div offsets just in case the div moved
		this.zoombarDiv.offsets = null;
		OpenLayers.Event.stop(evt);
	},

	/*
	 * Method: zoomBarDrag This is what happens when a click has occurred, and the client is dragging. Here we must ensure that the slider
	 * doesn't go beyond the bottom/top of the zoombar div, as well as moving the slider to its new visual location
	 * 
	 * Parameters: evt - {<OpenLayers.Event>}
	 */
	zoomBarDrag : function(evt) {
		if (this.mouseDragStart != null) {
			var deltaY = this.mouseDragStart.y - evt.xy.y;
			var offsets = OpenLayers.Util.pagePosition(this.zoombarDiv);
			if ((evt.clientY - offsets[1]) > 0 && (evt.clientY - offsets[1]) < parseInt(this.zoombarDiv.style.height) - 2) {
				var newTop = parseInt(this.slider.style.top) - deltaY;
				this.slider.style.top = newTop + "px";
				this.mouseDragStart = evt.xy.clone();
			}
			// set cumulative displacement
			this.deltaY = this.zoomStart.y - evt.xy.y;
			OpenLayers.Event.stop(evt);
		}
	},

	/*
	 * Method: zoomBarUp Perform cleanup when a mouseup event is received -- discover new zoom level and switch to it.
	 * 
	 * Parameters: evt - {<OpenLayers.Event>}
	 */
	/*
	 * zoomBarUp:function(evt) { if (!OpenLayers.Event.isLeftClick(evt) && evt.type !== "touchend") { return; } if (this.mouseDragStart) {
	 * this.div.style.cursor=""; this.map.events.un({ "touchmove": this.passEventToSlider, "mouseup": this.passEventToSlider, "mousemove":
	 * this.passEventToSlider, scope: this }); var zoomLevel = this.map.zoom; if (!this.forceFixedZoomLevel && this.map.fractionalZoom) {
	 * zoomLevel += this.deltaY/this.zoomStopHeight; zoomLevel = Math.min(Math.max(zoomLevel, 0), this.map.getNumZoomLevels() - 1); } else {
	 * zoomLevel += this.deltaY/this.zoomStopHeight; zoomLevel = Math.max(Math.round(zoomLevel), 0); } this.map.zoomTo(zoomLevel);
	 * this.mouseDragStart = null; this.zoomStart = null; this.deltaY = 0; OpenLayers.Event.stop(evt); } },
	 */

	/*
	 * Method: moveZoomBar Change the location of the slider to match the current zoom level.
	 */
	/*
	 * moveZoomBar:function() { var newTop = ((this.map.getNumZoomLevels()-1) - this.map.getZoom()) * this.zoomStopHeight + this.startTop +
	 * 1; this.slider.style.top = newTop + "px"; },
	 */

	CLASS_NAME : "OpenLayers.Control.PanZoomBarA"
});
