package com.web.trv.auth.dao;

import com.web.trv.auth.model.UserVo;
import com.web.trv.comn.model.Tmap;
import org.apache.ibatis.annotations.Mapper;

import java.util.Map;

/**
 * <pre>
 * com.web.trv.auth.dao.AuthDao
 *  - AuthDao.java
 * </pre>
 *
 * @author : tarr4h
 * @ClassName : AuthDao
 * @description :
 * @date : 2023-04-19
 */
@Mapper
public interface AuthDao {
    UserVo selectUser(Map<String, Object> param);

    Map<String, Object> selectLoginUser(Map<String, Object> param);

    int updateLoginUser(Map<String, Object> param);

    int insertLoginUser(Map<String, Object> param);

    Map<String, Long> checkUserExist(Map<String, Object> param);

    int insertUser(Map<String, Object> param);
}
