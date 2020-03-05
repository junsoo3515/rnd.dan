/**
 * --------------------------------------------------------------------------------------------------------------
 * @Class Name : LgnLoginServiceImpl.java
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
package kr.co.ucp.dan.login.service.impl;
import egovframework.rte.fdl.cmmn.EgovAbstractServiceImpl;
import kr.co.ucp.dan.login.mapper.LgnLoginMapper;
import kr.co.ucp.dan.login.service.LgnLoginService;
import kr.co.ucp.dan.login.vo.ConfigureVO;
import kr.co.ucp.dan.login.vo.LoginVO;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Properties;

@Service("lgnLoginService")
public class LgnLoginServiceImpl extends EgovAbstractServiceImpl implements LgnLoginService
{
	@Resource(name="lgnLoginMapper")
	private LgnLoginMapper lgnLoginMapper;
	@Resource(name = "config")
	private Properties config;

	// 일반 로그인을 처리한다
	public LoginVO login(Map<String, String> args) throws Exception
	{
		// 2. 아이디와 암호화된 비밀번호가 DB와 일치하는지 확인한다.
		LoginVO loginVO = lgnLoginMapper.selectLogin(args);
		// 3. 결과를 리턴한다.
		if (loginVO != null && !loginVO.getMemId().equals("") && !loginVO.getPwd().equals("")) {
			return loginVO;
		} else {
			loginVO = new LoginVO();
		}
		return loginVO;
	}

	// 패스워드 찾기
	public LoginVO findPwd(Map<String, String> args) throws Exception
	{
		LoginVO loginVO = lgnLoginMapper.findPwd(args);
		// 3. 결과를 리턴한다.
		if (loginVO != null && !loginVO.getMemId().equals("") && !loginVO.getPwd().equals("")) {
			Map<String, String> tmp = new HashMap<String, String>();
			tmp.put("AAA", "111");
			lgnLoginMapper.insertSms(tmp);
			return loginVO;
		} else {
			loginVO = new LoginVO();
		}
		return loginVO;
	}

	// 로그인 이력 저장
	public int insertConnectUserCnt(LoginVO loginVO) throws Exception {
		return lgnLoginMapper.insertConnectUserCnt(loginVO);
		
	}

	@Override
	public List<ConfigureVO> selectMappingIp(ConfigureVO configure) throws Exception {
		return lgnLoginMapper.selectMappingIp(configure);
	}

}