package com.web.trv.auth.controller;

import com.web.trv.auth.model.UserVo;
import com.web.trv.auth.service.AuthService;
import lombok.extern.slf4j.Slf4j;
import org.apache.coyote.Response;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
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

    @Autowired
    AuthService service;

    @PostMapping("login")
    public ResponseEntity<?> login(@RequestBody Map<String, Object> param, HttpServletRequest req){
        UserVo user = service.selectUser(param);
        boolean bool = false;
        if(user != null){
            HttpSession session = req.getSession();
            session.setAttribute("loginUserId", user.getId());
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
        param.put("id", session.getAttribute("loginUserId"));
        service.changeLoginUserStatus(param);

        session.removeAttribute("loginUserId");
        session.removeAttribute("loginUser");
        return ResponseEntity.ok(true);
    }

    @GetMapping("isLogin")
    public ResponseEntity<?> isLogin(HttpServletRequest req){
        HttpSession session = req.getSession();
        Object id = session.getAttribute("loginUserId");

        boolean bool = true;
        if(id == null){
            bool = false;
        }

        return ResponseEntity.ok().body(bool);
    }

    @PostMapping("join")
    public ResponseEntity<?> join(@RequestBody Map<String, Object> param){
        return ResponseEntity.ok().body(service.join(param));
    }
}
