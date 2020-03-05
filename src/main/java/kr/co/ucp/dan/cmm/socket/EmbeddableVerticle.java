/**
* ----------------------------------------------------------------------------------------------
* @Class Name : EmbeddableVerticle.java
* @Description : 
* @Version : 1.0
* Copyright (c) 2015 by KR.CO.UCP.MNTR All rights reserved.
* @Modification Information
* ----------------------------------------------------------------------------------------------
* DATE AUTHOR DESCRIPTION
* ----------------------------------------------------------------------------------------------
* 2014. 11. 17. SaintJuny 최초작성
*
* ----------------------------------------------------------------------------------------------
*/
package kr.co.ucp.dan.cmm.socket;

import org.vertx.java.core.Vertx;

/**
 * @author Keesun Baik
 */
public interface EmbeddableVerticle {

    void start(Vertx vertx);

    String host();

    int port();

}