package com.web.trv.program.plan.model;

import lombok.Getter;
import lombok.Setter;

/**
 * <pre>
 * com.web.trv.program.plan.model.PlanVo
 *   - PlanVo.java
 * </pre>
 *
 * @author : 한태우
 * @ClassName : PlanVo
 * @description :
 * @date : 2023/07/19
 */
@Getter
@Setter
public class PlanVo {

    String id;
    String userId;
    String nm;
    String startTm;
    String endTm;
    String startLocNm;
    String startLocLat;
    String startLocLng;
    String modDt;
}
