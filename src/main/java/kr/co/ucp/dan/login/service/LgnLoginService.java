/**
 * --------------------------------------------------------------------------------------------------------------
 * @Class Name : LgnLoginService.java
 * @Description : 일반 로그인을 처리
 * @Version : 1.0
 * Copyright (c) 2016 by KR.CO.UCP.CNU All rights reserved.
 * @Modification Information
 * --------------------------------------------------------------------------------------------------------------
 * DATE            AUTHOR      DESCRIPTION
 * --------------------------------------------------------------------------------------------------------------
 * 2016. 11.08.    seungJun    최초작성
 * --------------------------------------------------------------------------------------------------------------
 */
package kr.co.ucp.dan.login.service;


import kr.co.ucp.dan.login.vo.ConfigureVO;
import kr.co.ucp.dan.login.vo.LoginVO;

import java.util.List;
import java.util.Map;

public interface LgnLoginService
{
	// 일반 로그인을 처리한다
	public LoginVO login(Map<String, String> args) throws Exception;
	// 일반 로그인을 처리한다
	public LoginVO findPwd(Map<String, String> args) throws Exception;
	// 사용자 접속로그
	public int insertConnectUserCnt(LoginVO resultVO) throws Exception;

	List<ConfigureVO> selectMappingIp(ConfigureVO configure) throws Exception;
}