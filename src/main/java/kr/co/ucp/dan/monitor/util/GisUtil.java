/**
 * ----------------------------------------------------------------------------------------------
 * @Class Name : GisUtil.java
 * @Description : 
 * @Version : 1.0
 * Copyright (c) 2014 by KR.CO.UCP All rights reserved.
 * @Modification Information
 * ----------------------------------------------------------------------------------------------
 * DATE AUTHOR DESCRIPTION
 * ----------------------------------------------------------------------------------------------
 * 2015. 10. 28. SaintJuny@ubolt.co.kr 최초작성
 *
 * ----------------------------------------------------------------------------------------------
 */
package kr.co.ucp.dan.monitor.util;

import com.jhlabs.map.proj.Projection;
import com.jhlabs.map.proj.ProjectionFactory;
import egovframework.rte.psl.dataaccess.util.EgovMap;
import kr.co.ucp.dan.monitor.cmm.util.StringUtils;
import org.springframework.stereotype.Component;

import javax.annotation.Resource;
import java.awt.geom.Point2D;
import java.io.IOException;
import java.sql.SQLException;
import java.text.DecimalFormat;
import java.util.*;

@Component("gisUtil")
public class GisUtil {
	@Resource(name = "config")
	private Properties config;
	
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
					tp = convertWGS842WTMK( map.get(lon).toString(), map.get(lat).toString() );
				}
				// EPSG:900913 (VWorld)
				else if(config.getProperty("Mntr.Gis.Projection").equals("EPSG:900913")) {
					tp = convertWGS842GoogleMercator(map.get(lon).toString(), map.get(lat).toString());
				}
				// EPSG:5179 (기타지역)
				else {
					tp = convertWGS842UTMK( map.get(lon).toString(), map.get(lat).toString() );
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
	
	public Point2D.Double convertWGS842UTMK(String lon, String lat) {
		String[] proj4Param = new String[] { 
		        "+proj=tmerc", 
		        "+lat_0=38N", 
		        "+lon_0=127.5E", 
		        "+ellps=GRS80", 
		        "+units=m", 
		        "+x_0=1000000",
		        "+y_0=2000000",
		        "+k=0.9996"
		};
		if (lon.indexOf(":")>=0) {
			String[] slon = lon.split(":");
			String[] slat = lat.split(":");
			String[] sslon = slon[1].split("\\.");
			String[] sslat = slat[1].split("\\.");
			lon = Double.toString(Double.parseDouble(slon[0]) + (Integer.parseInt(sslon[0])/60.0 + Integer.parseInt(sslon[1])/3600.0));
			lat = Double.toString(Double.parseDouble(slat[0]) + (Integer.parseInt(sslat[0])/60.0 + Integer.parseInt(sslat[1])/3600.0));
		}
		Point2D.Double rst = new Point2D.Double();
		Projection toUTMK = ProjectionFactory.fromPROJ4Specification(proj4Param);
		toUTMK.transform(new Point2D.Double(Double.parseDouble(lon), Double.parseDouble(lat)), rst);
		return rst;
	}
	
	public Point2D.Double convertWGS842WTMK(String lon, String lat) {
		String[] proj4Param = new String[] { 
		        "+proj=tmerc", 
		        "+lat_0=38N", 
		        "+lon_0=127.0E", 
		        "+ellps=GRS80", 
		        "+units=m", 
		        "+x_0=200000",
		        "+y_0=600000",
		        "+k=1"
		};
		if (lon.indexOf(":")>=0) {
			String[] slon = lon.split(":");
			String[] slat = lat.split(":");
			String[] sslon = slon[1].split("\\.");
			String[] sslat = slat[1].split("\\.");
			lon = Double.toString(Double.parseDouble(slon[0]) + (Integer.parseInt(sslon[0])/60.0 + Integer.parseInt(sslon[1])/3600.0));
			lat = Double.toString(Double.parseDouble(slat[0]) + (Integer.parseInt(sslat[0])/60.0 + Integer.parseInt(sslat[1])/3600.0));
		}
		Point2D.Double rst = new Point2D.Double();
		Projection toUTMK = ProjectionFactory.fromPROJ4Specification(proj4Param);
		toUTMK.transform(new Point2D.Double(Double.parseDouble(lon), Double.parseDouble(lat)), rst);
		return rst;
	}
	
	public Point2D.Double convertWGS842ETM(String lon, String lat) {
		String[] proj4Param = new String[] { 
		        "+proj=tmerc", 
		        "+lat_0=38N", 
		        "+lon_0=127.0E", 
		        "+ellps=GRS80", 
		        "+units=m", 
		        "+x_0=200000",
		        "+y_0=500000",
		        "+k=1"
		};
		if (lon.indexOf(":")>=0) {
			String[] slon = lon.split(":");
			String[] slat = lat.split(":");
			String[] sslon = slon[1].split("\\.");
			String[] sslat = slat[1].split("\\.");
			lon = Double.toString(Double.parseDouble(slon[0]) + (Integer.parseInt(sslon[0])/60.0 + Integer.parseInt(sslon[1])/3600.0));
			lat = Double.toString(Double.parseDouble(slat[0]) + (Integer.parseInt(sslat[0])/60.0 + Integer.parseInt(sslat[1])/3600.0));
		}
		Point2D.Double rst = new Point2D.Double();
		Projection toETM = ProjectionFactory.fromPROJ4Specification(proj4Param);
		toETM.transform(new Point2D.Double(Double.parseDouble(lon), Double.parseDouble(lat)), rst);
		return rst;
	}
	
	public Point2D.Double convertWGS842UTMK(double lon, double lat) {
		String[] proj4Param = new String[] { 
		        "+proj=tmerc", 
		        "+lat_0=38N", 
		        "+lon_0=127.5E", 
		        "+ellps=GRS80", 
		        "+units=m", 
		        "+x_0=1000000",
		        "+y_0=2000000",
		        "+k=0.9996"
		};

		Point2D.Double rst = new Point2D.Double();
		Projection toUTMK = ProjectionFactory.fromPROJ4Specification(proj4Param);
		toUTMK.transform(new Point2D.Double(lon, lat), rst);
		return rst;
	}

	public Point2D.Double convertWGS842GoogleMercator(String lon, String lat) {
		String[] proj4Param = new String[] { 
		        "+proj=merc", 
		        "+a=6378137",
		        "+b=6378137",
		        "+lat_ts=0.0",
		        "+lon_0=0.0",
		        "+x_0=0.0",
		        "+y_0=0",
		        "+k=1.0",
		        "+units=m",
		        "+nadgrids=@null",
		        "+no_defs"
		};

		if (lon.indexOf(":")>=0) {
			String[] slon = lon.split(":");
			String[] slat = lat.split(":");
			String[] sslon = slon[1].split("\\.");
			String[] sslat = slat[1].split("\\.");
			lon = Double.toString(Double.parseDouble(slon[0]) + (Integer.parseInt(sslon[0])/60.0 + Integer.parseInt(sslon[1])/3600.0));
			lat = Double.toString(Double.parseDouble(slat[0]) + (Integer.parseInt(sslat[0])/60.0 + Integer.parseInt(sslat[1])/3600.0));
		}
		Point2D.Double rst = new Point2D.Double();
		Projection toGoogleMercator = ProjectionFactory.fromPROJ4Specification(proj4Param);
		toGoogleMercator.transform(new Point2D.Double(Double.parseDouble(lon), Double.parseDouble(lat)), rst);
		return rst;
	}
	
	public Point2D.Double convertBessel2KATEC(String lon, String lat) {
		String[] proj4Param = new String[] { 
		        "+proj=tmerc", 
		        "+lat_0=38N", 
		        "+lon_0=128E", 
		        "+ellps=bessel", 
		        "+units=m", 
		        "+x_0=400000",
		        "+y_0=600000",
		        "+k=0.9999"
		};

		Point2D.Double rst = new Point2D.Double();
		Projection toUTMK = ProjectionFactory.fromPROJ4Specification(proj4Param);
		toUTMK.transform(new Point2D.Double(Double.parseDouble(lon), Double.parseDouble(lat)), rst);
		return rst;
	}
	
	public  Point2D.Double convertUTMK2WGS84(String lon, String lat) {
		String[] proj4Param = new String[] { 
		        "+proj=tmerc", 
		        "+lat_0=38N", 
		        "+lon_0=127.5E", 
		        "+ellps=GRS80", 
		        "+units=m", 
		        "+x_0=1000000",
		        "+y_0=2000000",
		        "+k=0.9996"
		};

		Point2D.Double rst = new Point2D.Double();
		Projection toUTMK = ProjectionFactory.fromPROJ4Specification(proj4Param);
		toUTMK.inverseTransform(new Point2D.Double(Double.parseDouble(lon), Double.parseDouble(lat)), rst);
		return rst;
	}
	
	public  Point2D.Double convertWTMK2WGS84(String lon, String lat) {
		String[] proj4Param = new String[] { 
		        "+proj=tmerc", 
		        "+lat_0=38N", 
		        "+lon_0=127.0E", 
		        "+ellps=GRS80", 
		        "+units=m", 
		        "+x_0=200000",
		        "+y_0=600000",
		        "+k=1"
		};

		Point2D.Double rst = new Point2D.Double();
		Projection toUTMK = ProjectionFactory.fromPROJ4Specification(proj4Param);
		toUTMK.inverseTransform(new Point2D.Double(Double.parseDouble(lon), Double.parseDouble(lat)), rst);
		return rst;
	}
	
	public  Point2D.Double convertETM2WGS84(String lon, String lat) {
		String[] proj4Param = new String[] { 
		        "+proj=tmerc", 
		        "+lat_0=38N", 
		        "+lon_0=127.0E", 
		        "+ellps=GRS80", 
		        "+units=m", 
		        "+x_0=200000",
		        "+y_0=500000",
		        "+k=1"
		};

		Point2D.Double rst = new Point2D.Double();
		Projection toETM = ProjectionFactory.fromPROJ4Specification(proj4Param);
		toETM.inverseTransform(new Point2D.Double(Double.parseDouble(lon), Double.parseDouble(lat)), rst);
		return rst;
	}
	
	public  Point2D.Double convertGoogleMercator2WGS84(String lon, String lat) {
		String[] proj4Param = new String[] { 
		        "+proj=merc", 
		        "+a=6378137",
		        "+b=6378137",
		        "+lat_ts=0.0",
		        "+lon_0=0.0",
		        "+x_0=0.0",
		        "+y_0=0",
		        "+k=1.0",
		        "+units=m",
		        "+nadgrids=@null",
		        "+no_defs"
		};

		Point2D.Double rst = new Point2D.Double();
		Projection toGoogleMercator = ProjectionFactory.fromPROJ4Specification(proj4Param);
		toGoogleMercator.inverseTransform(new Point2D.Double(Double.parseDouble(lon), Double.parseDouble(lat)), rst);
		return rst;
	}
	
	public Point2D.Double convertKATEC2Bessel(String lon, String lat) {
		String[] proj4Param = new String[] { 
		        "+proj=tmerc", 
		        "+lat_0=38N", 
		        "+lon_0=128E", 
		        "+ellps=bessel", 
		        "+units=m", 
		        "+x_0=400000",
		        "+y_0=600000",
		        "+k=0.9999"
		};

		Point2D.Double rst = new Point2D.Double();
		Projection toUTMK = ProjectionFactory.fromPROJ4Specification(proj4Param);
		toUTMK.inverseTransform(new Point2D.Double(Double.parseDouble(lon), Double.parseDouble(lat)), rst);
		return rst;
	}	

	public Point2D.Double convertUTMK2KATEC(String lon, String lat) {
		Point2D.Double r = convertUTMK2WGS84(lon, lat);
		Point2D.Double r1 = convertEllipWGS842Bessel(r);
		Point2D.Double rst = convertBessel2KATEC(Double.toString(r1.getX()),Double.toString(r1.getY()));
		return rst;
	}

	public Point2D.Double convertKATEC2UTMK(String lon, String lat) {
		Point2D.Double r = convertKATEC2Bessel(lon, lat);
		Point2D.Double r1 = convertEllipBessel2WGS84(r);
		Point2D.Double rst = convertWGS842UTMK(Double.toString(r1.getX()),Double.toString(r1.getY()));
		return rst;
	}
	
	public Point2D.Double convertEllipBessel2WGS84(Point2D.Double in) {

		
		Ellipsoid bessel1841 = new Ellipsoid(6377397.155, 1.0 / 299.152813);
		Ellipsoid wgs1984 = new Ellipsoid(6378137, 1.0 / 298.257223563);
		Parameters7 params = new Parameters7(
		    -115.8, 474.99, 674.11,
		    -1.16, 2.31, 1.63,
		    6.43
		);

		Ellip2Ellipsoid tr = new Ellip2Ellipsoid(bessel1841, wgs1984, params);
		Values3 src = new Values3(in.getY(), in.getX(), 0);
		Values3 dst = new Values3();
		tr.transfom(src, dst);
		Point2D.Double rst = new Point2D.Double(dst.V2, dst.V1);
		return rst;
	}

	public Point2D.Double convertEllipWGS842Bessel(Point2D.Double in) {


		Ellipsoid bessel1841 = new Ellipsoid(6377397.155, 1.0 / 299.152813);
		Ellipsoid wgs1984 = new Ellipsoid(6378137, 1.0 / 298.257223563);
		Parameters7 params = new Parameters7(
		    -115.8, 474.99, 674.11,
		    -1.16, 2.31, 1.63,
		    6.43
		);

		Ellip2Ellipsoid tr = new Ellip2Ellipsoid(bessel1841, wgs1984, params);
		Values3 src = new Values3(in.getY(), in.getX(), 0);
		Values3 dst = new Values3();
		tr.reverseTransform(src, dst);
		Point2D.Double rst = new Point2D.Double(dst.V2, dst.V1);
		return rst;
	}
	
//	public String CLOB2String(CLOB cl) throws IOException, SQLException 
//	 {
//		 if (cl == null) 
//			 return "";
//	
//		 StringBuffer strOut = new StringBuffer();
//		 String aux;
//	
//		 BufferedReader br = new BufferedReader(cl.getCharacterStream());
//	
//		 while ((aux=br.readLine())!=null)
//			strOut.append(aux);
//	
//		 return strOut.toString();
//	 } 	

	public String wktTransform(Object owkt, String transform) throws IOException, SQLException {
		//long st = System.currentTimeMillis();
		//String wkt = CLOB2String((CLOB)owkt);
		String wkt = (String)owkt;
		//System.out.println("1: " + (System.currentTimeMillis()-st)+"msec");
		Point2D.Double tp = new Point2D.Double();
		int sp = wkt.indexOf("((");
		//System.out.println("2: " + (System.currentTimeMillis()-st)+"msec");
		int ep = wkt.indexOf("))");
		//System.out.println("3: " + (System.currentTimeMillis()-st)+"msec");
		String sb = wkt.substring(sp+2,ep);
		String[] ssb = sb.split(transform.equals("wu")?", ":",");
		//System.out.println("4: " + (System.currentTimeMillis()-st)+"msec");
		String[] xy = {};
		String a = new String();
		ArrayList<String> r = new ArrayList<String>();

		if (transform.equals("wu")||transform.equals("uw")) {
			DecimalFormat df = new DecimalFormat(transform.equals("wu")?".##":".########");
			for (int i=0;i<ssb.length;i++) {
				xy = ssb[i].split(" ");
				if (transform.equals("wu")) {
					tp = convertWGS842UTMK(xy[0], xy[1]);
				}
				else if (transform.equals("uw")) {
					tp = convertUTMK2WGS84(xy[0], xy[1]);
				} else {
					break;
				}
				//a = Double.toString(tp.getX()) + " " + Double.toString(tp.getY());
				a = df.format(tp.getX()) + " " + df.format(tp.getY());
				r.add(a);
			}
			
			String joined = StringUtils.join(r, ",");

			return wkt.substring(0,sp) + "((" + joined + "))";

		} else {
			return wkt;
		}

	}
	
	public String wktLineTransform(Object owkt, String transform) throws IOException, SQLException {

		String wkt = (String)owkt;

		Point2D.Double tp = new Point2D.Double();
		int sp = wkt.indexOf("(");

		int ep = wkt.indexOf(")");

		String sb = wkt.substring(sp+1,ep);
		String[] ssb = sb.split(transform.equals("wu")?", ":",");

		String[] xy = {};
		String a = new String();
		ArrayList<String> r = new ArrayList<String>();

		if (transform.equals("wu")||transform.equals("uw")) {
			DecimalFormat df = new DecimalFormat(transform.equals("wu")?".##":".########");
			for (int i=0;i<ssb.length;i++) {
				xy = ssb[i].split(" ");
				if (transform.equals("wu")) {
					tp = convertWGS842UTMK(xy[0], xy[1]);
				}
				else if (transform.equals("uw")) {
					tp = convertUTMK2WGS84(xy[0], xy[1]);
				} else {
					break;
				}
				a = df.format(tp.getX()) + " " + df.format(tp.getY());
				r.add(a);
			}
			
			String joined = StringUtils.join(r, ",");

			return wkt.substring(0,sp) + "(" + joined + ")";

		} else {
			return wkt;
		}

	}

	public String geoJsonTransform(Object owkt, String transform) throws IOException, SQLException {
		//long st = System.currentTimeMillis();
		//String wkt = CLOB2String((CLOB)owkt);
		String wkt = (String)owkt;
		//System.out.println("1: " + (System.currentTimeMillis()-st)+"msec");
		Point2D.Double tp = new Point2D.Double();
		int sp = wkt.indexOf("((");
		//System.out.println("2: " + (System.currentTimeMillis()-st)+"msec");
		int ep = wkt.indexOf("))");
		//System.out.println("3: " + (System.currentTimeMillis()-st)+"msec");
		String sb = wkt.substring(sp+2,ep);
		String[] ssb = sb.split(transform.equals("wu")?", ":",");
		//System.out.println("4: " + (System.currentTimeMillis()-st)+"msec");
		String[] xy = {};
		String a = new String();
		ArrayList<String> r = new ArrayList<String>();

		if (transform.equals("wu")||transform.equals("uw")) {
			DecimalFormat df = new DecimalFormat(transform.equals("wu")?".##":".########");
			for (int i=0;i<ssb.length;i++) {
				xy = ssb[i].split(" ");
				if (transform.equals("wu")) {
					tp = convertWGS842UTMK(xy[0], xy[1]);
				}
				else if (transform.equals("uw")) {
					tp = convertUTMK2WGS84(xy[0], xy[1]);
				} else {
					break;
				}
				//a = Double.toString(tp.getX()) + " " + Double.toString(tp.getY());
				a = "[" + df.format(tp.getX()) + "," + df.format(tp.getY()) + "]";
				r.add(a);
			}
			
			String joined = StringUtils.join(r, ",");

			//return wkt.substring(0,sp) + "((" + joined + "))";
			return joined;

		} else {
			return wkt;
		}

	}

	public String geoJsonTransform(double[] dd, String transform) throws IOException, SQLException {

		Point2D.Double tp = new Point2D.Double();
		String a = new String();
		ArrayList<String> r = new ArrayList<String>();

		if (transform.equals("wu")||transform.equals("uw")) {
			DecimalFormat df = new DecimalFormat(transform.equals("wu")?".##":".########");
			for (int i=0;i<dd.length;i+=2) {
				if (transform.equals("wu")) {
					tp = convertWGS842UTMK(dd[i],dd[i+1]);
				} else {
					break;
				}
				a = "[" + df.format(tp.getX()) + "," + df.format(tp.getY()) + "]";
				r.add(a);
			}
			String joined = StringUtils.join(r, ",");
			return joined;

		} else {
			return Arrays.toString(dd);
		}

	}
	
	public String wktTransformPoint(Object owkt, String transform) throws IOException, SQLException {
		String wkt = (String)owkt;
		Point2D.Double tp = new Point2D.Double();
		int sp = wkt.indexOf("(");
		int ep = wkt.indexOf(")");
		String sb = wkt.substring(sp+1,ep);
		//String[] ssb = sb.split(transform.equals("wu")?", ":",");
		String[] xy = {};
		String a = new String();
		ArrayList<String> r = new ArrayList<String>();

		if (transform.equals("wu")||transform.equals("uw")) {
			DecimalFormat df = new DecimalFormat(transform.equals("wu")?".##":".########");
/*			for (int i=0;i<ssb.length;i++) {
				xy = ssb[i].split(" ");
				if (transform.equals("wu")) {
					tp = convertWGS842UTMK(xy[0], xy[1]);
				}
				else if (transform.equals("uw")) {
					tp = convertUTMK2WGS84(xy[0], xy[1]);
				} else {
					break;
				}
				a = df.format(tp.getX()) + " " + df.format(tp.getY());
				r.add(a);
			}*/
			xy = sb.split(" ");
			if (transform.equals("wu")) {
				tp = convertWGS842UTMK(xy[0], xy[1]);
			}
			else if (transform.equals("uw")) {
				tp = convertUTMK2WGS84(xy[0], xy[1]);
			}
			a = df.format(tp.getX()) + " " + df.format(tp.getY());
			r.add(a);			
			String joined = StringUtils.join(r, ",");

			return wkt.substring(0,sp) + "(" + joined + ")";

		} else {
			return wkt;
		}

	}
	
	public List<EgovMap> truncateTempNm(List<EgovMap> in, String fieldNm) {
		List<EgovMap> out = in;

		for (EgovMap itr : out) {
			itr.put(fieldNm, ((String)itr.get(fieldNm)).substring(0,7) + "...");

		}
		return out;
	}
	
	public byte[] generateImage( byte[] imageContent, int maxWidth, double xyRatio) throws IOException {
		
		/*	
        BufferedImage originalImg = ImageIO.read( new ByteArrayInputStream(imageContent));

        //get the center point for crop
        int[] centerPoint = { originalImg.getWidth() /2, originalImg.getHeight() / 2 };

        //calculate crop area
        int cropWidth=originalImg.getWidth();
        int cropHeight=originalImg.getHeight();

 

        if( cropHeight > cropWidth * xyRatio ) {
            //long image
            cropHeight = (int) (cropWidth * xyRatio);
        } else {
            //wide image
            cropWidth = (int) ( (float) cropHeight / xyRatio) ;
        }

        //set target image size
        int targetWidth = cropWidth;
        int targetHeight = cropHeight;

        if( targetWidth > maxWidth) {
            //too big image
            targetWidth = maxWidth;
            targetHeight = (int) (targetWidth * xyRatio);
        }

        //processing image
        BufferedImage targetImage = new BufferedImage(targetWidth, targetHeight, BufferedImage.TYPE_INT_RGB);
        Graphics2D graphics2D = targetImage.createGraphics();
        graphics2D.setBackground(Color.WHITE);
        graphics2D.setPaint(Color.WHITE);
        graphics2D.fillRect(0, 0, targetWidth, targetHeight);
        graphics2D.setRenderingHint(RenderingHints.KEY_INTERPOLATION, RenderingHints.VALUE_INTERPOLATION_BILINEAR);
        graphics2D.drawImage(originalImg, 0, 0, targetWidth, targetHeight,   centerPoint[0] - (int)(cropWidth /2) , centerPoint[1] - (int)(cropHeight /2), centerPoint[0] + (int)(cropWidth /2), centerPoint[1] + (int)(cropHeight /2), null);
        ByteArrayOutputStream output = new ByteArrayOutputStream();
        ImageIO.write(targetImage, "jpeg", output);
        
        return output.toByteArray();
        */
		
		return null;

    }


	
}
