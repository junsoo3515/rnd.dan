/**
 * ----------------------------------------------------------------------------------------------
 * @Class Name : CmmCodeController.java
 * @Description : GIM 공통 요청 컨트롤러
 * @Version : 1.0
 * Copyright (c) 2014 by KR.CO.UCP.CNU All rights reserved.
 * @Modification Information
 * ----------------------------------------------------------------------------------------------
 * DATE AUTHOR DESCRIPTION
 * ----------------------------------------------------------------------------------------------
 * 2014. 11. 7. is 최초작성
 *
 * ----------------------------------------------------------------------------------------------
 */
package kr.co.ucp.dan.monitor.cmm.web;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("dan")
public class CmmCodeController {


	/*
	 * 유효성검사
	 */
	@RequestMapping("/monitor/validator.do")
	public String validate() {
		return "empty/common/validator";
	}

}
