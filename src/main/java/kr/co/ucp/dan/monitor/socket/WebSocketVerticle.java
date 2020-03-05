/**
 * ----------------------------------------------------------------------------------------------
 * @Class Name : SocketIoServerTest.java
 * @Description : 
 * @Version : 1.0
 * Copyright (c) 2015 by KR.CO.UCP.MNTR All rights reserved.
 * @Modification Information
 * ----------------------------------------------------------------------------------------------
 * DATE AUTHOR DESCRIPTION
 * ----------------------------------------------------------------------------------------------
 * 2014. 10. 30. SaintJuny 최초작성
 *
 * ----------------------------------------------------------------------------------------------
 */
package kr.co.ucp.dan.monitor.socket;

import com.nhncorp.mods.socket.io.SocketIOServer;
import com.nhncorp.mods.socket.io.SocketIOSocket;
import com.nhncorp.mods.socket.io.impl.DefaultSocketIOServer;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.vertx.java.core.Handler;
import org.vertx.java.core.Vertx;
import org.vertx.java.core.http.HttpServer;
import org.vertx.java.core.json.JsonObject;

// @Controller
public class WebSocketVerticle extends DefaultEmbeddableVerticle {

	private static Logger logger = LogManager.getLogger(WebSocketVerticle.class);

	private SocketIOServer io;

	@Override
	public void start(Vertx vertx) {
		HttpServer server = vertx.createHttpServer();
		io = new DefaultSocketIOServer(vertx, server);
//		logger.info("start Vertx {} ", "22222");
		io.sockets().onConnection(new Handler<SocketIOSocket>() {
			public void handle(final SocketIOSocket socket) {
				socket.emit("welcome");

				socket.on("msg", new Handler<JsonObject>() {
					public void handle(JsonObject msg) {
						socket.emit("msg", msg);
						logger.info("get message : " + msg.getString("msg"));
					}
				});
			}
		});
		server.listen(65530);
	}

	public SocketIOServer getIo() {
		return io;
	}

	public void sendMsg(JsonObject msg) {
		if (io != null) {
			logger.info("get message : " + msg.getString("msg"));
			io.sockets().emit("response", msg);
		}
	}
}
