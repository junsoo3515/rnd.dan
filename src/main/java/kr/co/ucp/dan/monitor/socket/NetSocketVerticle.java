/**
 * ----------------------------------------------------------------------------------------------
 * @Class Name : NetSocketVerticle.java
 * @Description : 
 * @Version : 1.0
 * Copyright (c) 2015 by KR.CO.UCP.MNTR All rights reserved.
 * @Modification Information
 * ----------------------------------------------------------------------------------------------
 * DATE AUTHOR DESCRIPTION
 * ----------------------------------------------------------------------------------------------
 * 2014. 10. 30. SaintJuny 최초작성
 * 2014. 12. 11. SaintJuny 이벤트 전문 변경으로 인한 코드 수정
 * ----------------------------------------------------------------------------------------------
 */
package kr.co.ucp.dan.monitor.socket;


import egovframework.rte.psl.dataaccess.util.EgovMap;
import kr.co.ucp.dan.monitor.main.service.DanFcltMntrService;
import kr.co.ucp.dan.monitor.main.vo.EventVO;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.vertx.java.core.Handler;
import org.vertx.java.core.Vertx;
import org.vertx.java.core.buffer.Buffer;
import org.vertx.java.core.json.JsonObject;
import org.vertx.java.core.net.NetServer;
import org.vertx.java.core.net.NetSocket;

import javax.annotation.Resource;

// @Controller
public class NetSocketVerticle extends DefaultEmbeddableVerticle {

	private static Logger logger = LogManager.getLogger(NetSocketVerticle.class);
	private static String delimeterMsg = (char) 0x1E + "";

	@Resource(name = "webSocketVerticle")
	private WebSocketVerticle webSocketVerticle;

	@Resource(name = "danFcltMntrService")
	private DanFcltMntrService danFcltMntrService;

	private NetServer netServer;

	@Override
	public void start(Vertx vertx) {
		netServer = vertx.createNetServer();
		netServer.connectHandler(new Handler<NetSocket>() {
			@Override
			public void handle(final NetSocket netSocket) {

				logger.info("connect : " + netSocket.remoteAddress());

				netSocket.dataHandler(new Handler<Buffer>() {
					@SuppressWarnings("unused")
					@Override
					public void handle(Buffer buffer) {
						String msg = buffer.toString("UTF-8");
						msg = msg.replaceAll("\\r|\\n", "");
						String msgArray[] = msg.split(delimeterMsg);

						if (msgArray.length == 7 | msgArray[6].equals(";")) {
							String rcvGrp = msgArray[0];
							String evtId = msgArray[1];
							String evtPrgrsCd = msgArray[2];	// 10 20 30 90 91 92
							String evtOcrNo = msgArray[3];
							String sendType = msgArray[4];		// 'A' | 'M'
							String rgsUserId = msgArray[5];
							String end = msgArray[6];			// Always ;

							EventVO vo = new EventVO();
							vo.setEvtId(evtId);
							vo.setEvtPrgrsCd(evtPrgrsCd);
							vo.setEvtOcrNo(evtOcrNo);

							try {
								int count = danFcltMntrService.isExistEvent(vo);
								logger.info("count : " + count);
								if (count != 0) {
									EgovMap event = danFcltMntrService.selectEvent(vo);
									JsonObject obj = new JsonObject(event);
									logger.info(obj.toString());

									webSocketVerticle.getIo().sockets().emit("response", obj);

									netSocket.write("00000");
									netSocket.write("\n");
									logger.info("received socket message 4: 00000");
								}
								else {
									netSocket.write("11111");
									netSocket.write("\n");
									logger.info("received socket message 5: 11111");
								} // Not Exists Event.
							}
							catch (Exception e) {
								netSocket.write("11111");
								netSocket.write("\n");
								logger.info("received socket message 6: 11111" + e.getMessage());
							} // Exception Error
						}
						else {
							netSocket.write("11111");
							netSocket.write("\n");
							logger.info("received socket message 7: 11111");
						}	// Invalid Message Format
					}
				}); // dataHandler

				netSocket.closeHandler(new Handler<Void>() {
					@Override
					public void handle(Void arg0) {
						logger.info("closed : " + netSocket.remoteAddress());
					}
				});
			}// netSocket connectHandler
		}).listen(65525);
	}
}
