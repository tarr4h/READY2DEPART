package com.web.trv.program.plan.controller;

import com.web.trv.program.plan.service.PlanService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

/**
 * <pre>
 * com.web.trv.program.plan.controller.PlanController
 *   - PlanController.java
 * </pre>
 *
 * @author : 한태우
 * @ClassName : PlanController
 * @description :
 * @date : 2023/07/17
 */
@RestController
@RequestMapping("/plan")
public class PlanController {

    @Autowired
    PlanService service;


    @PostMapping("insertPlanDay")
    public ResponseEntity<?> insertPlanDay(@RequestBody Map<String, Object> param){
        return ResponseEntity.ok().body(service.insertPlanDay(param));
    }
}
