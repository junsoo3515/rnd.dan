/*
 * Copyright 2014 MOSPA(Ministry of Security and Public Administration).

 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
package kr.co.ucp.dan.cmm;

import org.apache.ibatis.session.ResultHandler;
import org.apache.ibatis.session.RowBounds;
import org.apache.ibatis.session.SqlSessionFactory;
import org.mybatis.spring.support.SqlSessionDaoSupport;

import javax.annotation.Resource;
import java.util.List;

/**
 * Spring의 MyBatis 연동 지원 공통 parent DAO 클래스
 *
 * @author Vincent Han
 * @since 2.6
 *
 *  == 개정이력(Modification Information) ==
 *
 *   수정일      수정자           수정내용
 *  -------    --------    ---------------------------
 *   2014.01.22 권윤정  ResultHandler이용을 위한 listToOutUsingResultHandler() 메서드 추가
 *
 */
public abstract class EgovAbstractMapperSms extends SqlSessionDaoSupport {

    /**
     * Annotation 형식으로 sqlSession(SqlSessionFactoryBean)을 받아와
     * 이를 super(SqlSessionDaoSupport)의 setSqlSessionFactory 메서드를 호출하여 설정해 준다.
     * <p>
     * SqlSessionTemplate이 지정된 경우된 경우 이 SqlSessionFactory가 무시된다. (Batch 처리를 위해서는 SqlSessionTemplate가 필요)
     *
     *
     * @param sqlSession SqlSessionFactory로 MyBatis와의 연계를 위한 기본 클래스
     */
    @Resource(name = "sqlSession-sms")
    public void setSqlSessionFactory(SqlSessionFactory sqlSession) {
    	super.setSqlSessionFactory(sqlSession);
    }

    /**
     * 입력 처리 SQL mapping 을 실행한다.
     *
     * @param queryId -  입력 처리 SQL mapping 쿼리 ID
     * @param parameterObject - 입력 처리 SQL mapping 입력 데이터를 세팅한 파라메터 객체(보통 VO 또는 Map)
     *
     * @return DBMS가 지원하는 경우 insert 적용 결과 count
     */
    public int insert(String queryId, Object parameterObject) {
    	return getSqlSession().insert(queryId, parameterObject);
    }

    /**
     * 수정 처리 SQL mapping 을 실행한다.
     *
     * @param queryId - 수정 처리 SQL mapping 쿼리 ID
     * @param parameterObject - 수정 처리 SQL mapping 입력 데이터(key 조건 및 변경 데이터)를 세팅한 파라메터 객체(보통 VO 또는 Map)
     *
     * @return DBMS가 지원하는 경우 update 적용 결과 count
     */
    public int update(String queryId, Object parameterObject) {
        return getSqlSession().update(queryId, parameterObject);
    }

    /**
     * 삭제 처리 SQL mapping 을 실행한다.
     *
     * @param queryId - 삭제 처리 SQL mapping 쿼리 ID
     * @param parameterObject - 삭제 처리 SQL mapping 입력 데이터(일반적으로 key 조건)를  세팅한 파라메터 객체(보통 VO 또는 Map)
     *
     * @return DBMS가 지원하는 경우 delete 적용 결과 count
     */
    public int delete(String queryId, Object parameterObject) {
        return getSqlSession().delete(queryId, parameterObject);
    }

    /**
     * pk 를 조건으로 한 단건조회 처리 SQL mapping 을 실행한다.
     *
     * @param queryId - 단건 조회 처리 SQL mapping 쿼리 ID
     * @param parameterObject - 단건 조회 처리 SQL mapping 입력 데이터(key)를 세팅한 파라메터 객체(보통 VO 또는 Map)
     *
     * @return 결과 객체 - SQL mapping 파일에서 지정한 resultType/resultMap 에 의한 단일 결과 객체(보통 VO 또는 Map)
     */
    public Object selectOne(String queryId, Object parameterObject) {
        return getSqlSession().selectOne(queryId, parameterObject);
    }

    /**
     * 리스트 조회 처리 SQL mapping 을 실행한다.
     *
     * @param queryId - 리스트 조회 처리 SQL mapping 쿼리 ID
     * @param parameterObject - 리스트 조회 처리 SQL mapping 입력 데이터(조회 조건)를 세팅한 파라메터 객체(보통 VO 또는 Map)
     *
     * @return 결과 List 객체 - SQL mapping 파일에서 지정한  resultType/resultMap 에 의한 결과 객체(보통 VO   또는 Map)의 List
     */
	public List<?> list(String queryId, Object parameterObject) {
        return getSqlSession().selectList(queryId, parameterObject);
    }

    /**
     * 부분 범위 리스트 조회 처리 SQL mapping 을 실행한다.
     * (부분 범위 - pageIndex 와 pageSize 기반으로 현재 부분 범위 조회를 위한 skipResults, maxResults 를 계산하여 ibatis 호출)
     *
     * @param queryId - 리스트 조회 처리 SQL mapping 쿼리 ID
     * @param parameterObject - 리스트 조회 처리 SQL mapping 입력 데이터(조회 조건)를 세팅한 파라메터 객체(보통 VO 또는 Map)
     * @param pageIndex - 현재 페이지 번호
     * @param pageSize - 한 페이지 조회 수(pageSize)
     *
     * @return 부분 범위 결과 List 객체 - SQL mapping 파일에서 지정한 resultType/resultMap 에 의한 부분 범위 결과 객체(보통 VO 또는 Map) List
     */
	public List<?> listWithPaging(String queryId, Object parameterObject, int pageIndex, int pageSize) {
        int skipResults = pageIndex * pageSize;
        //int maxResults = (pageIndex * pageSize) + pageSize;

        RowBounds rowBounds = new RowBounds(skipResults, pageSize);

        return getSqlSession().selectList(queryId, parameterObject, rowBounds);
    }

    /**
     * SQL 조회 결과를 ResultHandler를 이용해서 출력한다.
     * ResultHandler를 상속해 구현한 커스텀 핸들러의 handleResult() 메서드에 따라 실행된다.
     *
     * @param queryId - 리스트 조회 처리 SQL mapping 쿼리 ID
     * @param handler - 조회 결과를 제어하기 위해 구현한 ResultHandler
     * @return
     *
     * @return 결과 List 객체 - SQL mapping 파일에서 지정한 resultType/resultMap 에 의한 결과 객체(보통 VO   또는 Map)의 List
     */
    public void  listToOutUsingResultHandler(String queryId, ResultHandler handler) {
		getSqlSession().select(queryId, handler);
    }
}
