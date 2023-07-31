package com.web.trv.program.plan.model;

import com.web.trv.program.board.model.BoardVo;
import lombok.Getter;
import lombok.Setter;

/**
 * <pre>
 * com.web.trv.program.plan.model.PlanDoVo
 *   - PlanDoVo.java
 * </pre>
 *
 * @author : 한태우
 * @ClassName : PlanDoVo
 * @description :
 * @date : 2023/07/19
 */
@Getter
@Setter
public class PlanDoVo implements Comparable<PlanDoVo> {

    private String id;
    private String dayId;
    private String boardId;
    private int ordr;
    private String expectedTm;
    private int stayTmMin;
    private int travelTmMin;
    private String modDt;

    private BoardVo board;

    private double startDistance;

    @Override
    public int compareTo(PlanDoVo planDo) {
        if(this.getStartDistance() < planDo.getStartDistance()){
            return -1;
        } else if(this.getStartDistance() == planDo.getStartDistance()){
            return 0;
        } else {
            return 1;
        }
    }
}
