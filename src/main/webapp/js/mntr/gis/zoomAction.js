function zoomAction() {
	_zoom = _map.getZoom();
	Gis.MapTools.setTextScale();
	//alert(_zoom & "," & _map.Resolution);
	//alert(_map.getResolution());
	//alert(_map.getZoom());
}

var _isFirstLoading = true;

function moveStartAction() {
	_startCenter = _map.getCenter();
}


function moveEndAction() {
	_extent =_map.getExtent();
	gotoIndexPosition();
}

Gis.MarkingStyleMap = new OpenLayers.StyleMap({
	"default": new OpenLayers.Style(
			{
				
				externalGraphic: "../../images/gis/L2_03_W.png",
				//externalGraphic: "${getIcon}",
				backgroundGraphic: "${getBackGroundImage}",
				backgroundXOffset: "${getBackgroundXOffset}",
				backgroundYOffset: "${getBackgroundYOffset}",
				backgroundHeight: "${getBackgroundHeight}",
				backgroundWidth: "${getBackgroundWidth}",
				graphicYOffset: -38,
				graphicZIndex: 11,
				backgroundGraphicZIndex: 10,
				pointRadius: 20,
				graphicOpacity: 1,
				fillColor: "#FF9933",
				fillOpacity: 0.5,
				strokeWidth: 3,
				strokeOpacity: 1,
				strokeColor: "#FF0000",
				cursor: "pointer"
			},
			{
				context: {
					getIcon: function(afeature) {
						//todo
					},
					getBackGroundImage: function(afeature) {
						//todo
					},
					getBackgroundXOffset: function(afeature) {
						//todo
					},
					getBackgroundYOffset: function(afeature) {
						//todo
					},
					getBackgroundHeight: function(afeature) {
						//todo	
					},
					getBackgroundWidth: function(afeature) {
						//todo
					}
				}
			}),
	"select": {pointRadius: 20, fillOpacity: 1}
});


