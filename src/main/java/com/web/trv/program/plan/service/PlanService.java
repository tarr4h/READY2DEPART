package com.web.trv.program.plan.service;

import com.web.trv.program.plan.dao.PlanDao;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Map;

/**
 * <pre>
 * com.web.trv.program.plan.service.PlanService
 *   - PlanService.java
 * </pre>
 *
 * @author : 한태우
 * @ClassName : PlanService
 * @description :
 * @date : 2023/07/17
 */
@Service
@Slf4j
public class PlanService {

    @Autowired
    PlanDao dao;

    public Object insertPlanDay(Map<String, Object> param) {
        log.debug("insertPlanDay param = {}", param);
        return null;
    }
}
