/**
 * -----------------------------------------------------------------
 * @Class Name : DomParser.java
 * @Description : 
 * @Version : 1.0
 * Copyright (c) 2016 by KR.CO.UCP All rights reserved.
 * @Modification Information
 * -----------------------------------------------------------------
 * DATE          AUTHOR      DESCRIPTION
 * -----------------------------------------------------------------
 * 2016. 10. 21.   [이름]    최초작성
 * -----------------------------------------------------------------
 */
package kr.co.ucp.dan.cmm;

import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.w3c.dom.NodeList;
import org.xml.sax.SAXException;

import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.parsers.ParserConfigurationException;
import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class DomParser
{
	String tag;
	String params;
	String filePath;

	List<Map<String, String>> xmlData;
	Document dom;

	/**
	 * @param path : 파일경로
	 * @param params : 태그 파리미터 목록
	 * @param tag : 데이터 리스트 태그
	 */
	public DomParser(String path, String params, String tag)
	{
		xmlData = new ArrayList();
		this.filePath = path;
		this.params = params;
		this.tag = tag;
	}

	public void run()
	{
		parseXmlFile();
		parseDocument();
	}

	public List<Map<String, String>> getList()
	{
		parseXmlFile();
		parseDocument();
		return this.xmlData;
	}

	private void parseXmlFile()
	{
		DocumentBuilderFactory dbf = DocumentBuilderFactory.newInstance();
		try {
			DocumentBuilder db = dbf.newDocumentBuilder();
			dom = db.parse(filePath);
		}catch(ParserConfigurationException pce) {
			pce.printStackTrace();
		}catch(SAXException se) {
			se.printStackTrace();
		}catch(IOException ioe) {
			ioe.printStackTrace();
		}
	}

	private void parseDocument()
	{
		Element docEle = dom.getDocumentElement();
		NodeList nl = docEle.getElementsByTagName(tag);
		if(nl != null && nl.getLength() > 0)
		{
			int cnt = nl.getLength();
			for(int i=0; i<cnt; i++)
			{
				Element el = (Element)nl.item(i);
				Map<String, String> e = getData(el);
				xmlData.add(e);
			}
		}
	}

	private Map<String, String> getData(Element empEl)
	{
		Map<String, String> map = new HashMap<String, String>();
		String[] str = params.split(",");
		int cnt = str.length;
		for(int i=0; i<cnt; i++) {
			map.put(str[i], getValue(empEl, str[i]));
		}
		return map;
	}

	private String getValue(Element ele, String tagName)
	{
		String textVal = null;
		NodeList nl = ele.getElementsByTagName(tagName);
		if(nl != null && nl.getLength() > 0) {
			Element el = (Element)nl.item(0);
			textVal = el.getFirstChild().getNodeValue();
		}
		return textVal;
	}
}
