package com.web.trv.program.plan.service;

import com.web.trv.comn.model.DrivingVo;
import com.web.trv.comn.util.CalcDistance;
import com.web.trv.comn.util.Utilities;
import com.web.trv.program.plan.dao.PlanDao;
import com.web.trv.program.plan.model.PlanDoVo;
import com.web.trv.program.plan.model.PlanVo;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;

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
        return dao.insertPlanDay(param);
    }

    public Object selectMyPlanList(Map<String, Object> param) {
        log.debug("param = {}", param);
        if(param.get("boardId") != null){
            List<PlanDoVo> planDoList = dao.selectMyPlanDoList(param);
            if(planDoList.size() != 0){
                param.put("existPlanDay", planDoList);
            }
        }
        return dao.selectMyPlanList(param);
    }


    public Object selectPlan(Map<String, Object> param) {
        return dao.selectPlan(param);
    }

    @SuppressWarnings("unchecked")
    public Object insertPlanDo(Map<String, Object> param) {
        int result = 0;

        String boardId = (String) param.get("boardId");
        List<String> planList = (List<String>) param.get("selectedPlanList");
        for(String dayId : planList){
            Map<String, Object> map = new HashMap<>();
            map.put("dayId", dayId);
            map.put("boardId", boardId);
            result += dao.insertPlanDo(map);
        }

        return result;
    }

    @SuppressWarnings("unchecked")
    public Object deletePlanDay(Map<String, Object> param) {
        log.debug("param = {}", param);
        int result = 0;

        List<String> planDayList = (List<String>) param.get("selectedPlanList");
        for(String dayId : planDayList){
            log.debug("--------------------------------------------------");
            Map<String, Object> map = new HashMap<>();
            map.put("dayId", dayId);
            List<PlanDoVo> planDoList = dao.selectMyPlanDoList(map);
            int doDelResult = 0;
            for(PlanDoVo planDo : planDoList){
                doDelResult += dao.deletePlanDo(planDo);
            }
            log.debug("do del result = {}", doDelResult);

            map.put("id", dayId);
            result += dao.deletePlanDay(map);
            log.debug("fin del result = {}", result);
        }
        return result;
    }

    public Object selectDoList(Map<String, Object> param) {
        return lineUpPlanDo(param).getPlanDoList();
    }

    @SuppressWarnings("unchecked")
    public Object updatePlanDay(Map<String, Object> param) {
        int result = dao.updatePlanDay(param);
        if(param.get("stayTmList") != null){
            List<Map<String, Object>> stayTmList = (List<Map<String, Object>>) param.get("stayTmList");
            for(Map<String, Object> stayObj : stayTmList){
                PlanDoVo planDo = dao.selectPlanDo(stayObj);
                planDo.setStayTmMin(Integer.parseInt((String) stayObj.get("stayTm")));
                dao.updatePlanDo(planDo);
            }
        }

        return setExpectedTime(lineUpPlanDo(param));
    }

    public PlanVo lineUpPlanDo(Map<String, Object> param){
        if(param.get("dayId") == null && param.get("id") != null){
            param.put("dayId", param.get("id"));
        } else if(param.get("id") == null && param.get("dayId") != null){
            param.put("id", param.get("dayId"));
        } else if(param.get("id") == null && param.get("dayId") == null) {
            throw new RuntimeException("PLAN ID가 조회되지 않습니다.");
        }

        PlanVo plan = dao.selectPlan(param);
        List<PlanDoVo> doList = dao.selectDoList(param);

        for(PlanDoVo planDo : doList){
            double a = planDo.getBoard().getDistrict().getLatitude();
            double b = planDo.getBoard().getDistrict().getLongitude();
            double centerDistance = CalcDistance.calculateArea(plan.getStartLocLat(), plan.getStartLocLng(), a, b);
            planDo.setStartDistance(centerDistance);
        }

        Collections.sort(doList);
        plan.setPlanDoList(doList);
        return plan;
    }

    public Object setExpectedTime(PlanVo plan){
        List<PlanDoVo> planDoList = plan.getPlanDoList();
        double startLat = plan.getStartLocLat();
        double startLng = plan.getStartLocLng();

        List<DrivingVo> drivList = new ArrayList<>();
        for(PlanDoVo planDo : planDoList){
            double goalLat = planDo.getBoard().getDistrict().getLatitude();
            double goalLng = planDo.getBoard().getDistrict().getLongitude();
            DrivingVo driving = Utilities.getDriving(startLat, startLng, goalLat, goalLng);
            drivList.add(driving);
            startLat = goalLat;
            startLng = goalLng;
        }

        return drivList;
    }
}
