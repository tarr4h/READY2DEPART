package com.web.trv.aop;

import com.web.trv.auth.model.UserVo;
import com.web.trv.comn.util.Utilities;
import lombok.extern.slf4j.Slf4j;
import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Before;
import org.springframework.stereotype.Component;

import java.util.HashMap;
import java.util.Map;

/**
 * <pre>
 * com.web.trv.aop.DaoAspect
 *   - DaoAspect.java
 * </pre>
 *
 * @author : 한태우
 * @ClassName : DaoAspect
 * @description :
 * @date : 2023/07/19
 */
@SuppressWarnings("unchecked")
@Aspect
@Component
@Slf4j
public class DaoAspect {


    @Before(value = "execution(* *..*Dao.*(..))")
    public void queryBefore(JoinPoint jp){
        Object[] args = jp.getArgs();
        Map<String, Object> param = new HashMap<>();
        for(Object arg : args){
            if(arg instanceof Map){
                param = (Map<String, Object>) arg;
            }
        }
        UserVo user = Utilities.getLoginUser();
        if(user != null){
            param.put("userId", user.getId());
        }
    }
}
