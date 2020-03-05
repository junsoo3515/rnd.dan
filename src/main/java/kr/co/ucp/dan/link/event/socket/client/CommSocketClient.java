/**
* ----------------------------------------------------------------------------------------------
* @Class Name : CommSocketClient.java
* @Description : 소켓클라이언트
* @Version : 1.0
* Copyright (c) 2015 by KR.CO.UCP All rights reserved.
* @Modification Information
* ----------------------------------------------------------------------------------------------
* DATE AUTHOR DESCRIPTION
* ----------------------------------------------------------------------------------------------
* 2015.01.08.   widecube Space  최초작성
*
* ----------------------------------------------------------------------------------------------
*/
package kr.co.ucp.dan.link.event.socket.client;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.BufferedInputStream;
import java.io.BufferedOutputStream;
import java.io.InputStream;
import java.net.InetSocketAddress;
import java.net.Socket;
import java.net.SocketException;
import java.net.SocketTimeoutException;
import java.util.HashMap;
import java.util.Map;
import java.util.regex.PatternSyntaxException;

public class CommSocketClient {

	private String targetIp;
	private String sendYn = "Y";
	private int targetPort;
	private int connTimeout;
	private int respTimeout;
	private int returnLength;

	private ClassLoader cl;

	static Logger logger = LoggerFactory.getLogger(CommSocketClient.class);

	public CommSocketClient(){
		logger.info(" ==== cCommSocketClient Start==== >>>> ");

		cl = Thread.currentThread().getContextClassLoader();

		if(cl == null){
			cl = ClassLoader.getSystemClassLoader();
		}
	}

	/**
	 * 소켓기본정보
	 * @param dest_code
	 */
	private void setSocket(String dest_code){
		//'220.73.136.26|5773|10000|10000|5|Y'
		try {
			String[] dest_code_arr 	= dest_code.split("\\|");
			this.targetIp 			= dest_code_arr[0].trim();
			this.targetPort 		= Integer.parseInt(dest_code_arr[1].trim());
			this.connTimeout 		= Integer.parseInt(dest_code_arr[2].trim());
			this.respTimeout 		= Integer.parseInt(dest_code_arr[3].trim());
			this.returnLength 		= Integer.parseInt(dest_code_arr[4].trim());
			this.sendYn 			= dest_code_arr[5].trim();

			logger.debug("targetIp :" + targetIp);
			logger.debug("targetPort :" + targetPort);
			logger.debug("connTimeout :" + connTimeout);
			logger.debug("respTimeout :" + respTimeout);
			logger.debug("returnLength :" + returnLength);
			logger.debug("sendYn :" + sendYn);
		} catch (PatternSyntaxException e) {
			logger.error("setSocket PatternSyntaxException : {}", e.getMessage());
		} catch (NumberFormatException e) {
			logger.error("setSocket NumberFormatException : {}", e.getMessage());
		} catch (ArrayIndexOutOfBoundsException e) {
			logger.error("setSocket ArrayIndexOutOfBoundsException : {}", e.getMessage());
		} catch (Exception e) {
			logger.error("setSocket Exception : {}", e.getMessage());
		}
	}

	/**
	 * SMS 전송
	 * @param msg
	 * @param dest_code
	 * @return
	 */
	public Map<String, Object> smsSend(String msg, String dest_code)  {
		Map<String, Object> map_ret = new HashMap<String, Object>();

		String resp_ = "00000";

		setSocket(dest_code); //소켓연결정보

		logger.debug("SMS Send Packet :" + msg);

		String respStr = "";
		if ("Y".equals(sendYn)) {
			Socket socketServer = null;
			InputStream is = null;
			BufferedInputStream bis = null;
			BufferedOutputStream bos = null;
			try {
				//logger.info(" ====0 {} msg send >>>> [{}] ",dest_code, msg);
				byte[] body = msg.getBytes("utf-8");


				socketServer = new Socket();
				socketServer.connect(new InetSocketAddress(targetIp, targetPort), connTimeout);		// 소켓 연결 타입아웃 시간 설정
				socketServer.setSoTimeout(respTimeout);

				bos = new BufferedOutputStream(socketServer.getOutputStream());

				bos.write(body);
				bos.flush();

				bis = new BufferedInputStream(socketServer.getInputStream());

				byte [] b = new byte[returnLength];
				int offset = 0;

				offset = bis.read(b, 0, b.length);
				respStr = new String(b, 0, offset, "UTF-8");

				logger.info(respStr);

				resp_ =  respStr;
			}catch(SocketException ce){
				logger.error("Exception smsSend : {}",ce.getMessage());
				try { Thread.sleep(300); } catch (InterruptedException e) {
					logger.error("InterruptedException : {}",e.getMessage());
				}
				resp_ =  "11111";
			}catch(SocketTimeoutException ste) {
				logger.error("Exception smsSend : {}",ste.getMessage());
				resp_ =  "11111";
			}catch(Exception ex){
				logger.error("Exception smsSend : {}",ex.getMessage());
				resp_ =  "11111";
			}finally{
				try{
					if(is != null)  is.close();
					if(bos != null)	bos.close();
					if(bis != null)	bis.close();
					if(socketServer != null) socketServer.close();
				}catch(Exception e){
					logger.error("Exception smsSend : {}",e.getMessage());
				}
			}
		}
		map_ret.put("code", resp_);
		return map_ret;
	}
}
