package kr.co.ucp.dan.cmm.util;

import kr.co.ucp.dan.link.event.socket.client.CommSocketClient;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.servlet.http.HttpServletRequest;
import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;


public class CommonUtil {
	static Logger logger = LoggerFactory.getLogger(CommSocketClient.class);
	private static String delimeter1E = (char) 0x1E + "";
	private static String delimeter1F = (char) 0x1F + "";

	public static int smsSend(String socketOpt, String sendNo, String sendMsg, List<String> recvNoList) throws Exception{

		String msg = "WKSMS" + delimeter1E;
		for(int i = 0; i < recvNoList.size(); i++) {
			String recvNo = recvNoList.get(i);

			msg += recvNo;
			if((i + 1) < recvNoList.size())
				msg += delimeter1F;

		}
		msg += delimeter1E + sendNo;
		msg += delimeter1E + sendMsg;
		msg += delimeter1E + ";";

		Map<String, Object> mapRet = new HashMap<String, Object>();
		CommSocketClient sockSend = new CommSocketClient();
		String resp = "";
		try{
			mapRet = sockSend.smsSend(msg, socketOpt);
		}
		catch(NullPointerException e) {
			logger.error("smsSend NullPointerException : {}",e.getMessage());
		}
		catch(Exception e){
			logger.error("smsSend Exception : {}",e.getMessage());
		}
		resp = (String) mapRet.get("code");

		if(!resp.equals("00000")) {
			return 0;
		}

		return 1;
	}
	
	public static boolean checkDataFilter(Map<String, String> map) {
        for(String key : map.keySet() ){
        	String value = map.get(key);
            if(value.indexOf("<") >= 0) return false;
            if(value.indexOf(">") >= 0) return false;
        }
        return true;
    }

	public static boolean checkDataFilterObj(Map<String, Object> map) {
        for(String key : map.keySet() ){
        	String value = (String) map.get(key);
            if(value.indexOf("<") >= 0) return false;
            if(value.indexOf(">") >= 0) return false;
        }
        return true;
    }
	
	public static boolean checkIp(HttpServletRequest request, String ipTyCd, String ipCd, String dbIp) {
		boolean bRet = false;

		ipTyCd 	= ipTyCd.toUpperCase().trim();
		ipCd	= ipCd.toUpperCase().trim();
		if(ipCd.equals("AL")) {
			return true;
		}
		
		String clientIp = request.getHeader("HTTP_X_FORWARDED_FOR");
		if(null == clientIp || clientIp.length() == 0 || clientIp.toLowerCase().equals("unknown")){  
			clientIp = request.getHeader("REMOTE_ADDR");
		} 
		if(null == clientIp || clientIp.length() == 0 || clientIp.toLowerCase().equals("unknown")){  
			clientIp = request.getRemoteAddr();
		}
		
		//clientIp = "127.1.2.3";
		//System.out.println("clientIp : " + clientIp);
		//System.out.println("ipTyCd : " + ipTyCd);
		//System.out.println("ipCd : " + ipCd);
		//System.out.println("dbIp : " + dbIp);
		
		if(ipTyCd.equals("IPV4")) {
			if(ipCd.equals("IP")) {
				if(clientIp.equals(dbIp))
					return true;
				else
					return false;
			}
			else if(ipCd.equals("DC")) {
				
			}
			else if(ipCd.equals("CC")) {
				dbIp = dbIp.split("\\.")[0] + "." + dbIp.split("\\.")[1] + "." + dbIp.split("\\.")[2];
				String ip = clientIp.split("\\.")[0] + "." + clientIp.split("\\.")[1] + "." + clientIp.split("\\.")[2];
				if(ip.equals(dbIp))
					return true;
				else
					return false;
			}
			else if(ipCd.equals("BC")) {
				dbIp = dbIp.split("\\.")[0] + "." + dbIp.split("\\.")[1];
				String ip = clientIp.split("\\.")[0] + "." + clientIp.split("\\.")[1];
				if(ip.equals(dbIp))
					return true;
				else
					return false;
			}
			else if(ipCd.equals("AC")) {
				dbIp = dbIp.split("\\.")[0];
				String ip = clientIp.split("\\.")[0];
				if(ip.equals(dbIp))
					return true;
				else
					return false;
			}
			
		}
		else {
			if(ipCd.equals("8B")) {
				if(clientIp.equals(dbIp))
					return true;
				else
					return false;
			}
			else if(ipCd.equals("7B")) {
				dbIp = dbIp.split("\\.")[0] + "." + dbIp.split("\\.")[1] + "." + dbIp.split("\\.")[2] + "." + dbIp.split("\\.")[3] + "." + dbIp.split("\\.")[4] + "." + dbIp.split("\\.")[5] + "." + dbIp.split("\\.")[6];
				String ip = clientIp.split("\\.")[0] + "." + clientIp.split("\\.")[1] + "." + clientIp.split("\\.")[2] + "." + clientIp.split("\\.")[3] + "." + clientIp.split("\\.")[4] + "." + clientIp.split("\\.")[5] + "." + clientIp.split("\\.")[6];
				if(ip.equals(dbIp))
					return true;
				else
					return false;
			}
			else if(ipCd.equals("6B")) {
				dbIp = dbIp.split("\\.")[0] + "." + dbIp.split("\\.")[1] + "." + dbIp.split("\\.")[2] + "." + dbIp.split("\\.")[3] + "." + dbIp.split("\\.")[4] + "." + dbIp.split("\\.")[5];
				String ip = clientIp.split("\\.")[0] + "." + clientIp.split("\\.")[1] + "." + clientIp.split("\\.")[2] + "." + clientIp.split("\\.")[3] + "." + clientIp.split("\\.")[4] + "." + clientIp.split("\\.")[5];
				if(ip.equals(dbIp))
					return true;
				else
					return false;
			}
			else if(ipCd.equals("5B")) {
				dbIp = dbIp.split("\\.")[0] + "." + dbIp.split("\\.")[1] + "." + dbIp.split("\\.")[2] + "." + dbIp.split("\\.")[3] + "." + dbIp.split("\\.")[4];
				String ip = clientIp.split("\\.")[0] + "." + clientIp.split("\\.")[1] + "." + clientIp.split("\\.")[2] + "." + clientIp.split("\\.")[3] + "." + clientIp.split("\\.")[4];
				if(ip.equals(dbIp))
					return true;
				else
					return false;
			}
			else if(ipCd.equals("4B")) {
				dbIp = dbIp.split("\\.")[0] + "." + dbIp.split("\\.")[1] + "." + dbIp.split("\\.")[2] + "." + dbIp.split("\\.")[3];
				String ip = clientIp.split("\\.")[0] + "." + clientIp.split("\\.")[1] + "." + clientIp.split("\\.")[2] + "." + clientIp.split("\\.")[3];
				if(ip.equals(dbIp))
					return true;
				else
					return false;
			}
			else if(ipCd.equals("3B")) {
				dbIp = dbIp.split("\\.")[0] + "." + dbIp.split("\\.")[1] + "." + dbIp.split("\\.")[2];
				String ip = clientIp.split("\\.")[0] + "." + clientIp.split("\\.")[1] + "." + clientIp.split("\\.")[2];
				if(ip.equals(dbIp))
					return true;
				else
					return false;
			}
			else if(ipCd.equals("2B")) {
				dbIp = dbIp.split("\\.")[0] + "." + dbIp.split("\\.")[1];
				String ip = clientIp.split("\\.")[0] + "." + clientIp.split("\\.")[1];
				if(ip.equals(dbIp))
					return true;
				else
					return false;
			}
			else if(ipCd.equals("1B")) {
				dbIp = dbIp.split("\\.")[0];
				String ip = clientIp.split("\\.")[0];
				if(ip.equals(dbIp))
					return true;
				else
					return false;
			}
			
		}
		return bRet;
	}
	
	public static Map<String, String> checkCar(String carNo) {
		boolean bRet = false;
	
		//System.out.println("checkCar Start");
  		Map<String, String> map = new HashMap<String, String>();

		char[] charArray = carNo.toCharArray();
		for(int j=0; j < charArray.length; j++) {
			if (charArray[j] >= 'A' && charArray[j] <= 'Z' || charArray[j] >= 'a' && charArray[j] <= 'z'){
				map.put("msg", "잘못된 차량번호입니다.(영문)");
				map.put("ret", "false");
				map.put("retCode", "01");
				return map;
		   }
		}
		for(int i = 0; i < carNo.length(); i++) {
			if("~`!@#$%^&*=+\\|[](){};:'<.,>/?_".indexOf(carNo.substring(i, i + 1)) >= 0) {
				map.put("msg", "잘못된 차량번호입니다.(특수문자)");
				map.put("ret", "false");
				map.put("retCode", "02");
				return map;
			}
		}
		//System.out.println("22222222222");
		if(carNo.split("-").length > 2) {
			map.put("msg", "잘못된 차량번호입니다.('-'갯수 초과)");
			map.put("ret", "false");
			map.put("retCode", "03");
			return map;
		}
		//System.out.println("33333");
		int han_check = 0;
		int num_check = 0;
		if(carNo.matches(".*[ㄱ-ㅎㅏ-ㅣ가-힣]+.*")) {
			//System.out.println("한글포함");
	    	han_check = 1;
		}

		int cnt = 0;
		String num_validate = "/^[0-9]*$/";
		if(carNo.indexOf("-") >= 0) {
			for(int j = 0; j < carNo.split("-").length; j++) {
				String num = carNo.split("-")[j];
				cnt = 0;
				charArray = num.toCharArray();
				for(int i = 0; i < charArray.length; i++) {
					if(charArray[i] >= '0' && charArray[i] <= '9') {
						num_check = 1;
						cnt++;
					}
					else {
						cnt = 0;
					}
				}
				//'-'로 나눠진 두군데 중 cnt==3이면 OK로 판단함.
				//만약 아니라면 cnt != 3으로 체크해서 판단해야함.
				if(cnt != 3) {
					map.put("msg", "잘못된 차량번호입니다.('-'있고, 연속된 숫자 갯수 오류)");
					map.put("ret", "false");
					map.put("retCode", "04");
					return map;
				}
			}
		}
		else {
			charArray = carNo.toCharArray();
			for(int i = 0; i < charArray.length; i++) {
				if(charArray[i] >= '0' && charArray[i] <= '9') {
					num_check = 1;
					cnt++;
				}
				else {
					cnt = 0;
				}
			}
			if(cnt != 4) {
				map.put("msg", "잘못된 차량번호입니다.('-'없고, 연속된 숫자 갯수 오류)");
				map.put("ret", "false");
				map.put("retCode", "05");
				return map;
			}
		}
		if(han_check != 1 || num_check != 1) {
			map.put("msg", "차량번호는 한글, 숫자가 필수로 입력되어야 합니다.");
			map.put("ret", "false");
			map.put("retCode", "06");
			return map;
		}
	
		map.put("msg", "");
		map.put("ret", "true");
		return map;
	}

	//	한글체크
	final int HANGUL_UNICODE_START = 0xAC00;
	final int HANGUL_UNICODE_END = 0xD7AF;
		 
	enum SYLLABLE_HANGUL
	{
		FULL_HANGUL, PART_HANGUL, NOT_HANGUL
	}
	 
	public SYLLABLE_HANGUL IsHangul(String text)
	{
		int text_count = text.length();
		SYLLABLE_HANGUL is_syllable_hangul;
 
		int is_hangul_count = 0;
 
		for (int i = 0; i < text_count; i++)
		{
			char syllable = text.charAt(i);
 
			if ((HANGUL_UNICODE_START <= syllable)
					&& (syllable <= HANGUL_UNICODE_END))
			{
				is_hangul_count++;
			}
		}
		if (is_hangul_count == text_count)
		{
			is_syllable_hangul = SYLLABLE_HANGUL.FULL_HANGUL;
		}
		else if (is_hangul_count == 0)
		{
			is_syllable_hangul = SYLLABLE_HANGUL.NOT_HANGUL;
		}
		else
		{
			is_syllable_hangul = SYLLABLE_HANGUL.PART_HANGUL;
		}
 
		return is_syllable_hangul;
	}
	
	public static boolean match(String input, String regexp) {
		Matcher matcher = Pattern.compile(regexp).matcher(input);
		String[] results = new String[matcher.groupCount() + 1];
 
		return matcher.find();
	}

	/**
	 * 객체가 null인지 확인하고 null인 경우 "" 로 바꾸는 메서드
	 * @param object 원본 객체
	 * @return resultVal 문자열
	 */
	public static String isNullToString(Object object)
	{
		String string = "";
		if (object != null) {
			string = object.toString().trim();
		}

		return string;
	}

	public static String isNullToDefaultVal(Object object, String args)
	{
		String string = "";
		if (object != null) {
			string = object.toString().trim();
		} else {
			string = args;
		}

		return string;
	}

	
	/**
	 * 현재시간 구하기 14자리(년월일시분초)
	 * @return String
	 */
	public static String getCurrentTime14()
	{
		GregorianCalendar calendar = new GregorianCalendar();
		StringBuffer rtnStr = new StringBuffer();

		rtnStr.append(checkByte(Integer.toString(calendar.get(Calendar.YEAR)), 4, "0"));
		rtnStr.append(checkByte(Integer.toString(calendar.get(Calendar.MONTH) + 1), 2, "0"));
		rtnStr.append(checkByte(Integer.toString(calendar.get(Calendar.DATE)), 2, "0"));
		rtnStr.append(checkByte(Integer.toString(calendar.get(Calendar.HOUR_OF_DAY)), 2, "0"));
		rtnStr.append(checkByte(Integer.toString(calendar.get(Calendar.MINUTE)), 2, "0"));
		rtnStr.append(checkByte(Integer.toString(calendar.get(Calendar.SECOND)), 2, "0"));
		
		return rtnStr.toString();
	}

	/**
	 * 현재시간 구하기 17자리(년월일시분초SSS)
	 * @return String
	 */
	public static String getCurrentTime17()
	{
		GregorianCalendar calendar = new GregorianCalendar();
		StringBuffer rtnStr = new StringBuffer();

		rtnStr.append(checkByte(Integer.toString(calendar.get(Calendar.YEAR)), 4, "0"));
		rtnStr.append(checkByte(Integer.toString(calendar.get(Calendar.MONTH) + 1), 2, "0"));
		rtnStr.append(checkByte(Integer.toString(calendar.get(Calendar.DATE)), 2, "0"));
		rtnStr.append(checkByte(Integer.toString(calendar.get(Calendar.HOUR_OF_DAY)), 2, "0"));
		rtnStr.append(checkByte(Integer.toString(calendar.get(Calendar.MINUTE)), 2, "0"));
		rtnStr.append(checkByte(Integer.toString(calendar.get(Calendar.SECOND)), 2, "0"));
		rtnStr.append(checkByte(Integer.toString(calendar.get(Calendar.MILLISECOND)), 3, "0"));
		
		return rtnStr.toString();
	}

	/**
	 * 자리수 채우기
	 * @param 	source : 문자열
	 * @param 	digit  : 자리수
	 * @param 	fillString : 채울문자
	 * @return	String
	 */
	public static String checkByte(String source, int digit, String fillString)
	{
		String rtnStr = "";

		if (source.length() < digit)
		{
			for (int i = 0; i < digit - source.length(); i++)
			{
				rtnStr += fillString;
			}
		}	

		rtnStr += source;

		return rtnStr;
	}

}
