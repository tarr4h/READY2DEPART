package com.web.trv.comn.util;

import com.web.trv.auth.model.UserVo;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

/**
 * <pre>
 * com.web.trv.comn.util.Utilities
 *   - Utilities.java
 * </pre>
 *
 * @author : 한태우
 * @ClassName : Utilities
 * @description :
 * @date : 2023/07/19
 */
public class Utilities {

    public static UserVo getLoginUser(){
        ServletRequestAttributes servletContainer = (ServletRequestAttributes) RequestContextHolder
                .getRequestAttributes();
        if(servletContainer != null){
            HttpServletRequest request = servletContainer.getRequest();
            HttpSession session = request.getSession();
            return (UserVo) session.getAttribute("loginUser");
        } else {
            return null;
        }
    }
}
