/**
 * ----------------------------------------------------------------------------------------------
 * @Class Name : GeoJsonUtility.java
 * @Description : GeoJson 관련 유틸리티
 * @Version : 1.0
 * Copyright (c) 2014 by KR.CO.UCP.CNU All rights reserved.
 * @Modification Information
 * ----------------------------------------------------------------------------------------------
 * DATE AUTHOR DESCRIPTION
 * ----------------------------------------------------------------------------------------------
 * 2015. 3. 17. SaintJuny@ubolt.co.kr 최초작성
 *
 * ----------------------------------------------------------------------------------------------
 */

package kr.co.ucp.dan.monitor.util;

import egovframework.rte.psl.dataaccess.util.EgovMap;

import javax.annotation.Resource;
import java.awt.geom.Point2D;
import java.util.*;

public class GeoJsonUtility {
	
	@Resource(name = "config")
	private Properties config;

	@Resource(name = "gisUtil")
	private GisUtil gisUtil;
	
	@SuppressWarnings({ "rawtypes", "unchecked" })
	public Map<String, Object> createGeoJson(List<EgovMap> list, String lon, String lat) {
		Map<String, Object> resultMap = new LinkedHashMap<String, Object>();
		
		resultMap.put("type", "FeatureCollection");
		
		List features = new LinkedList();
		
		for(EgovMap map : list) {
			Point2D.Double tp = new Point2D.Double();
			
			if (map.get(lon) != null || map.get(lon) != null) {
				// EPSG:5186 (광양-ArcGIS)
				if(config.getProperty("Mntr.Gis.Projection").equals("EPSG:5186")) {
					tp = gisUtil.convertWGS842WTMK( map.get(lon).toString(), map.get(lat).toString() );
				}
				// EPSG:900913 (VWorld)
				else if(config.getProperty("Mntr.Gis.Projection").equals("EPSG:900913")) {
					tp = gisUtil.convertWGS842GoogleMercator(map.get(lon).toString(), map.get(lat).toString());
				}
				// EPSG:5179 (기타지역)
				else {
					tp = gisUtil.convertWGS842UTMK( map.get(lon).toString(), map.get(lat).toString() );
				}
				
				List coordinates = new LinkedList();
				coordinates.add(tp.x);
				coordinates.add(tp.y);
				
				Map geometry = new HashMap();
				geometry.put("type", "Point");
				geometry.put("coordinates", coordinates);
				
				Map feature = new HashMap();
				feature.put("type", "Feature");
				feature.put("geometry", geometry);
				feature.put("properties", map);
				features.add(feature);
			}
			else {
				continue;
			}
		}
		
		resultMap.put("features", features);
		
		return resultMap;
	}
}