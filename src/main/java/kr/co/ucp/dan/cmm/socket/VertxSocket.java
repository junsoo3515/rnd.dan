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

package kr.co.ucp.dan.cmm.socket;

//import java.util.HashMap;
//import java.util.Map;

import com.nhncorp.mods.socket.io.SocketIOServer;
import com.nhncorp.mods.socket.io.SocketIOSocket;
import com.nhncorp.mods.socket.io.impl.DefaultSocketIOServer;
import egovframework.rte.fdl.property.EgovPropertyService;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.vertx.java.core.Handler;
import org.vertx.java.core.Vertx;
import org.vertx.java.core.http.HttpServer;
import org.vertx.java.core.json.JsonObject;

import javax.annotation.Resource;

//import com.nhncorp.mods.socket.io.impl.Room;


@Component
public class VertxSocket extends DefaultEmbeddableVerticle {

	
    /** EgovPropertyService */
    @Resource(name = "propertiesService")
    @Autowired
    protected EgovPropertyService propertiesService;
    
    
	private static Logger logger = LogManager.getLogger(VertxSocket.class);

	private SocketIOServer io;

	@Override
	public void start(Vertx vertx) {
		
		int port = Integer.parseInt(propertiesService.getString("Globals.MsgServerPort"));
				
		HttpServer server = vertx.createHttpServer();
		io = new DefaultSocketIOServer(vertx, server);
		
		io.sockets().onConnection(new Handler<SocketIOSocket>() {
			public void handle(final SocketIOSocket socket) {
				socket.emit("==============welcome=============");
				
				/* room manager */
				//Map<String, Room> rooms = new HashMap<String, Room>();
				//rooms = io.sockets().manager().rooms();
		
				
				socket.on("join", new Handler<JsonObject>() {
					public void handle(JsonObject msg) {
						//io.sockets().emit("response", msg);
						//socket.set("room", msg, null);

						logger.info("==========join : " + msg.getString("room"));
						socket.join(msg.getString("room"));
						
						//logger.info("==========join : " + msg.getString("grpReqNo"));
						//socket.join(msg.getString("grpReqNo"));						
						}
				});
				
				socket.on("request", new Handler<JsonObject>() {
					public void handle(JsonObject msg) {
						//sendMsg(msg);
						io.sockets().in(msg.getString("room")).emit("response",msg);
						
					}
				});
				socket.on("invite", new Handler<JsonObject>() {
					public void handle(JsonObject msg) {
						io.sockets().in(msg.getString("userid")).emit("invite",msg);
					}
				});		
				
				socket.on("add", new Handler<JsonObject>() {
					public void handle(JsonObject msg) {
						io.sockets().in(msg.getString("userid")).emit("invite",msg);
						io.sockets().in(msg.getString("grpSeqNo")).emit("add",msg);
					}
				});	
				
				socket.on("leave", new Handler<JsonObject>() {
					public void handle(JsonObject msg) {
						logger.info("==========leave : " + msg.getString("room"));
						socket.leave(msg.getString("room"));
						io.sockets().in(msg.getString("room")).emit("leave",msg);
						
					}
				});	
				
			}
		});
		
		server.listen(port);
	}

	public SocketIOServer getIo() {
		return io;
	}

	public void sendMsg(JsonObject msg) {
		if (io != null) {
			//logger.info("get message : " + msg.getString("msg"));
			io.sockets().emit("response", msg);
		}
	}
}
