package com.web.trv.auth.service;

import com.web.trv.auth.dao.AuthDao;
import com.web.trv.auth.model.UserVo;
import com.web.trv.comn.util.EncUtil;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

/**
 * <pre>
 * com.web.trv.auth.service.AuthService
 *  - AuthService.java
 * </pre>
 *
 * @author : tarr4h
 * @ClassName : AuthService
 * @description :
 * @date : 2023-04-19
 */

@Service
@Slf4j
public class AuthService {

    @Autowired
    AuthDao dao;

    public UserVo selectUser(Map<String, Object> param) {
        String enc = EncUtil.encryptPwd((String) param.get("id"), (String) param.get("pwd"));
        param.put("encPwd", enc);
        return dao.selectUser(param);
    }

    public void changeLoginUserStatus(Map<String, Object> param) {
        Map<String, Object> loginUser = dao.selectLoginUser(param);
        if(loginUser != null){
            if(loginUser.get("loginYn").equals("Y")){
                param.put("loginYn", "N");
            } else {
                param.put("loginYn", "Y");
            }
            log.debug("param = {}", param);
            dao.updateLoginUser(param);
        } else {
            dao.insertLoginUser(param);
        }
    }

    public Object join(Map<String, Object> param) {
        Map<String, Object> returnMap = new HashMap<>();
        boolean result = false;
        Map<String, Long> chkUser = dao.checkUserExist(param);
        if(chkUser.get("userIdDupCnt") != 0 || chkUser.get("phDupCnt") != 0 || chkUser.get("idDupCnt") != 0){
            returnMap.put("chkUser", chkUser);
        } else {
            param.put("encPwd", EncUtil.encryptPwd((String) param.get("password"), (String) param.get("id")));
            result = dao.insertUser(param) > 0;
        }
        returnMap.put("validate", result);
        return returnMap;
    }
}
