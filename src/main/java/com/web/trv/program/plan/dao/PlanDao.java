package com.web.trv.program.plan.dao;

import org.apache.ibatis.annotations.Mapper;

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
}
