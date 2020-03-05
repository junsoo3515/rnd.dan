package kr.co.ucp.dan.cmm.interceptor;

import kr.co.ucp.dan.cmm.util.EgovUserDetailsHelper;
import kr.co.ucp.dan.login.vo.LoginVO;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.web.servlet.ModelAndView;
import org.springframework.web.servlet.ModelAndViewDefiningException;
import org.springframework.web.servlet.handler.HandlerInterceptorAdapter;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.Set;

/**
 * 인증여부 체크 인터셉터
 * @author 공통서비스 개발팀 서준식
 * @since 2011.07.01
 * @version 1.0
 * @see
 *  
 * <pre>
 * << 개정이력(Modification Information) >>
 * 
 *   수정일      수정자          수정내용
 *  -------    --------    ---------------------------
 *  2011.07.01  서준식          최초 생성 
 *  2011.09.07  서준식          인증이 필요없는 URL을 패스하는 로직 추가
 *  </pre>
 */


public class AuthenticInterceptor extends HandlerInterceptorAdapter {
	
	private static Logger logger =  LogManager.getLogger(AuthenticInterceptor.class);
	
	private Set<String> permittedURL;
	
	public void setPermittedURL(Set<String> permittedURL) {
		this.permittedURL = permittedURL;
	}
	
	/**
	 * 세션에 계정정보(LoginVO)가 있는지 여부로 인증 여부를 체크한다.
	 * 계정정보(LoginVO)가 없다면, 로그인 페이지로 이동한다.
	 */
	@Override
	public boolean preHandle(HttpServletRequest request,	HttpServletResponse response, Object handler) throws Exception {	

		String requestURI = request.getRequestURI(); //요청 URI
		boolean isPermittedURL = false; 
		
		LoginVO loginVO = (LoginVO) EgovUserDetailsHelper.getAuthenticatedUser();


		logger.debug("========== Request URL : " + requestURI + " ==========");
		
		
		if (!"".equals(loginVO.getMemId())) {
			if(requestURI.toUpperCase().indexOf("dan/monitor/".toUpperCase()) != -1) {
				return true;
			}
			if(requestURI.toUpperCase().indexOf("dan/login/".toUpperCase()) != -1) {
				return true;
			}

			ModelAndView modelAndView = new ModelAndView("redirect:/dan/login/login.do");
			throw new ModelAndViewDefiningException(modelAndView);

		} else{
			ModelAndView modelAndView = new ModelAndView("redirect:/dan/login/login.do");
			throw new ModelAndViewDefiningException(modelAndView);
		}
	}

}
