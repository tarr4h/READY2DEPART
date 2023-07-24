package com.web.trv.program.plan.dao;

import com.web.trv.program.plan.model.PlanDoVo;
import com.web.trv.program.plan.model.PlanVo;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;
import java.util.Map;

/**
 * <pre>
 * com.web.trv.program.plan.dao.PlanDao
 *   - PlanDao.java
 * </pre>
 *
 * @author : 한태우
 * @ClassName : PlanDao
 * @description :
 * @date : 2023/07/17
 */
@Mapper
public interface PlanDao {


    int insertPlanDay(Map<String, Object> param);

    List<PlanVo> selectMyPlanList(Map<String, Object> param);

    List<PlanDoVo> selectMyPlanDoList(Map<String, Object> param);

    int insertPlanDo(Map<String, Object> param);

    int deletePlanDo(PlanDoVo planDo);

    int deletePlanDay(Map<String, Object> map);

    List<PlanDoVo> selectDoList(Map<String, Object> param);
}
