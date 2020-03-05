/**
 * --------------------------------------------------------------------------------------------------------------
 * @Class Name : LgnLoginDAO.java
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
package kr.co.ucp.dan.login.mapper;

import egovframework.rte.psl.dataaccess.mapper.Mapper;
import kr.co.ucp.dan.login.vo.ConfigureVO;
import kr.co.ucp.dan.login.vo.LoginVO;

import java.util.List;
import java.util.Map;

@Mapper("lgnLoginMapper")
public interface LgnLoginMapper
{
	public LoginVO selectLogin(Map<String, String> args) throws Exception ;

	public LoginVO findPwd(Map<String, String> args) throws Exception;

	public int insertConnectUserCnt(LoginVO loginVO) throws Exception;

	public int insertSms(Map<String, String> args) throws Exception;

	public List<ConfigureVO> selectMappingIp(ConfigureVO configure) throws Exception;
}
