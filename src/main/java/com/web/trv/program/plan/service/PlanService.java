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
        int result = 0;

        List<String> planDayList = (List<String>) param.get("selectedPlanList");
        for(String dayId : planDayList){
            Map<String, Object> map = new HashMap<>();
            map.put("dayId", dayId);
            List<PlanDoVo> planDoList = dao.selectMyPlanDoList(map);
            for(PlanDoVo planDo : planDoList){
                dao.deletePlanDo(planDo);
            }

            map.put("id", dayId);
            result += dao.deletePlanDay(map);
        }
        return result;
    }

    public Object selectDoList(Map<String, Object> param) {
        return dao.selectDoList(param);
    }

    @SuppressWarnings("unchecked")
    public Object updatePlanDay(Map<String, Object> param) {
        int result = dao.updatePlanDay(param);
        if(param.get("stayTmList") != null){
            List<Map<String, Object>> stayTmList = (List<Map<String, Object>>) param.get("stayTmList");
            for(Map<String, Object> stayObj : stayTmList){
                PlanDoVo planDo = dao.selectPlanDo(stayObj);
                int stayTm = 0;
                if(stayObj.get("stayTm") != null && !stayObj.get("stayTm").equals("")){
                    stayTm = Integer.parseInt((String) stayObj.get("stayTm"));
                }
                if(stayTm == 0){
                    planDo.setOrdr(9999);
                    planDo.setExpectedTm(null);
                    planDo.setTravelTmMin(0);
                }

                planDo.setStayTmMin(stayTm);
                dao.updatePlanDo(planDo);
            }
        }
        setExpectedTime(param);
        return result;
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

            if(planDo.getExpectedTm() != null && planDo.getStayTmMin() != 0){
                planDo.setDepartTm(Utilities.addMinToTimeFmt(planDo.getExpectedTm(), planDo.getStayTmMin()));
            }
        }

        Collections.sort(doList);
        plan.setPlanDoList(doList);
        return plan;
    }

    public void setExpectedTime(Map<String, Object> param){
        // 1. 계산로직 수정필요
        // 출발지와 무조건 가까운 순은 문제가 있음.
        // 종료위치를 지정할 수 있어야 함

        // 2. 사용자 순번 임의지정 시, 가까운 순 고려하지 않고 변경 가능하여야 함
        PlanVo plan = lineUpPlanDo(param);
        List<PlanDoVo> planDoList = plan.getPlanDoList();
        double startLat = plan.getStartLocLat();
        double startLng = plan.getStartLocLng();
        String stndTm = plan.getStartTm();

        int ordr = 1;
        int repeat = planDoList.size();
        for(int i = 0; i < repeat; i++){
            // 2번 고려 시 제외되어야 할 부분 START
            if(planDoList.size() == 0){
                break;
            }

            int getIndex = i;
            if(i != 0){
                int rowestIndex = 0;
                double rowestDistance = 0;
                for(int j = 0; j < planDoList.size(); j++){
                    PlanDoVo planDo = planDoList.get(j);
                    double a = planDo.getBoard().getDistrict().getLatitude();
                    double b = planDo.getBoard().getDistrict().getLongitude();
                    double betweenDistance = CalcDistance.calculateArea(startLat, startLng, a, b);
                    if(j == 0){
                        rowestDistance = betweenDistance;
                    } else {
                        if(rowestDistance > betweenDistance){
                            rowestDistance = betweenDistance;
                            rowestIndex = j;
                        }
                    }
                }
                getIndex = rowestIndex;
            }
            // 2번 고려 시 제외되어야 할 부분 END

            PlanDoVo planDo = planDoList.get(getIndex);
            // 확인한 do는 지워준다.
            planDoList.removeIf(value -> value.getId().equals(planDo.getId()));
            if(planDo.getStayTmMin() == 0){
                continue;
            }

            double goalLat = planDo.getBoard().getDistrict().getLatitude();
            double goalLng = planDo.getBoard().getDistrict().getLongitude();
            DrivingVo driving = Utilities.getDriving(startLat, startLng, goalLat, goalLng);
            planDo.setDrivingVo(driving);
            planDo.setOrdr(ordr);
            ordr++;

            // get duration
            try {
                if(driving == null){
                    throw new NullPointerException();
                }

                int duration = driving.getRoute().getTraoptimal().get(0).getSummary().getDuration(); // millisecond
                int min = Utilities.miliSec2min(duration);

                planDo.setTravelTmMin(min);
                // set expected tm
                String expectedTm = Utilities.addMinToTimeFmt(stndTm, min);
                planDo.setExpectedTm(expectedTm);

                stndTm = Utilities.addMinToTimeFmt(expectedTm, planDo.getStayTmMin());
            } catch (NullPointerException e){
                log.error("****** DRIVING NULL = {}", e.getMessage());
            }

            dao.updatePlanDo(planDo);
            startLat = goalLat;
            startLng = goalLng;
        }
    }

    public Object selectPlanRsltLocale(Map<String, Object> param) {
        PlanVo plan = dao.selectPlan(param);
        List<PlanDoVo> doList = dao.selectDoList(param);

        double centralLat = plan.getStartLocLat();
        double centralLng = plan.getStartLocLng();
        double radius = 0;

        doList.removeIf(value -> value.getStayTmMin() == 0);
        if(doList.size() != 0){
            double minLat = 0;
            double maxLat = 0;
            double minLng = 0;
            double maxLng = 0;
            for(PlanDoVo planDo : doList){
                if(minLat == 0 || planDo.getBoard().getDistrict().getLatitude() < minLat){
                    minLat = planDo.getBoard().getDistrict().getLatitude();
                }
                if(planDo.getBoard().getDistrict().getLatitude() > maxLat){
                    maxLat = planDo.getBoard().getDistrict().getLatitude();
                }
                if(minLng == 0 || planDo.getBoard().getDistrict().getLongitude() < minLng){
                    minLng = planDo.getBoard().getDistrict().getLongitude();
                }
                if(planDo.getBoard().getDistrict().getLongitude() > maxLng){
                    maxLng = planDo.getBoard().getDistrict().getLongitude();
                }
            }

            if(minLat > plan.getStartLocLat()){
                minLat = plan.getStartLocLat();
            }
            if(maxLat < plan.getStartLocLat()){
                maxLat = plan.getStartLocLat();
            }
            if(minLng > plan.getStartLocLng()){
                minLng = plan.getStartLocLng();
            }
            if(maxLng < plan.getStartLocLng()){
                maxLng = plan.getStartLocLng();
            }

            centralLat = (minLat + maxLat) / 2;
            centralLng = (minLng + maxLng) / 2;

            radius = Math.round(CalcDistance.getSqrtDistance(centralLat, centralLng, maxLat, maxLng));
        }

        Map<String, Object> returnMap = new HashMap<>();
        returnMap.put("centralLat", centralLat);
        returnMap.put("centralLng", centralLng);
        returnMap.put("radius", radius);

        return returnMap;
    }
}
