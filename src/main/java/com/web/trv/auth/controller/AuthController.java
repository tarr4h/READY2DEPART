package com.web.trv.auth.controller;

import com.web.trv.auth.model.UserVo;
import com.web.trv.auth.service.AuthService;
import com.web.trv.comn.util.Utilities;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

/**
 * <pre>
 * com.web.trv.auth.controller.AuthController
 *  - AuthController.java
 * </pre>
 *
 * @author : tarr4h
 * @ClassName : AuthController
 * @description :
 * @date : 2023-04-19
 */

@RestController
@Slf4j
@RequestMapping("/auth")
public class AuthController {

    @Value("${server.servlet.session.timeout}")
    private int sessionTimeout;

    @Autowired
    AuthService service;

    @PostMapping("login")
    public ResponseEntity<?> login(@RequestBody Map<String, Object> param, HttpServletRequest req){
        UserVo user = service.selectUser(param);
        boolean bool = false;
        if(user != null){
            HttpSession session = req.getSession();
            LocalDateTime loginTm = LocalDateTime.now();
            session.setAttribute("loginTm", loginTm);

            session.setAttribute("loginUser", user);
            param.put("ipAddr", req.getRemoteAddr());
            service.changeLoginUserStatus(param);

            bool = true;
        }
        return ResponseEntity.ok().body(bool);
    }

    @PostMapping("logout")
    public ResponseEntity<?> logout(HttpServletRequest req){
        HttpSession session = req.getSession();
        Map<String, Object> param = new HashMap<>();
        UserVo loginUser = Utilities.getLoginUser();
        if(loginUser != null){
            param.put("id", loginUser.getId());
            service.changeLoginUserStatus(param);

            session.removeAttribute("loginUser");
        }
        return ResponseEntity.ok(true);
    }

    @GetMapping("isLogin")
    public ResponseEntity<?> isLogin(HttpServletRequest req){
        HttpSession session = req.getSession();
        LocalDateTime loginTm = (LocalDateTime) session.getAttribute("loginTm");
        LocalDateTime current = LocalDateTime.now();
        boolean bool = true;
        UserVo loginUser = Utilities.getLoginUser();

        if(loginUser == null || (loginTm != null && loginTm.isBefore(current.minusSeconds(sessionTimeout)))){
            // 로그아웃
            log.debug("over 1 min");
            bool = false;
        } else {
            // 연장처리
            session.setAttribute("loginTm", LocalDateTime.now());
        }

        return ResponseEntity.ok().body(bool);
    }

    @PostMapping("join")
    public ResponseEntity<?> join(@RequestBody Map<String, Object> param){
        return ResponseEntity.ok().body(service.join(param));
    }
}
