Proj4js.defs["EPSG:5179"] = "+proj=tmerc +lat_0=38 +lon_0=127.5 +k=0.9996 +x_0=1000000 +y_0=2000000 +ellps=GRS80 +units=m +no_defs";
Proj4js.defs["EPSG:5186"] = "+proj=tmerc +lat_0=38 +lon_0=127 +k=1 +x_0=200000 +y_0=600000 +ellps=GRS80 +units=m +no_defs";
Proj4js.defs["EPSG:900913"] = "+proj=merc +a=6378137 +b=6378137 +lat_ts=0.0 +lon_0=0.0 +x_0=0.0 +y_0=0 +k=1.0 +units=m +nadgrids=@null +no_defs";
Proj4js.defs["EPSG:4326"] = "+proj=longlat +ellps=WGS84 +datum=WGS84 +no_defs";

function TMtoWGS84(x, y) {
	var itemLonLat = new OpenLayers.LonLat();
	var aLonLat = null;
	if(typeof gisProjection != 'undefined' && gisProjection != '') {
		aLonLat = OpenLayers.Projection.transform(new OpenLayers.Geometry.Point(x, y), new OpenLayers.Projection(gisProjection), new OpenLayers.Projection("WGS84"));
	}
	else {
		aLonLat = OpenLayers.Projection.transform(new OpenLayers.Geometry.Point(x, y), new OpenLayers.Projection("EPSG:5179"), new OpenLayers.Projection("WGS84"));
	}
	
	itemLonLat.lon = aLonLat.x;
	itemLonLat.lat = aLonLat.y;
	return {
		bounds : null,
		x : itemLonLat.lon,
		y : itemLonLat.lat
	};
}

function WGS84toTM(x, y) {
	var itemLonLat = new OpenLayers.LonLat();
	var aLonLat = null;
	if(typeof gisProjection != 'undefined' && gisProjection != '') {
		aLonLat = OpenLayers.Projection.transform(new OpenLayers.Geometry.Point(x, y), new OpenLayers.Projection("WGS84"), new OpenLayers.Projection(gisProjection));
	}
	else {
		aLonLat = OpenLayers.Projection.transform(new OpenLayers.Geometry.Point(x, y), new OpenLayers.Projection("WGS84"), new OpenLayers.Projection("EPSG:5179"));
	}
	
	itemLonLat.lon = aLonLat.x;
	itemLonLat.lat = aLonLat.y;
	return {
		bounds : null,
		x : itemLonLat.lon,
		y : itemLonLat.lat
	};
}
