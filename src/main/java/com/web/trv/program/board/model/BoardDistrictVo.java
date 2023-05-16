package com.web.trv.program.board.model;

import lombok.Getter;
import lombok.Setter;

/**
 * <pre>
 * com.web.trv.program.board.model.BoardDistrictVo
 *  - BoardDistrictVo.java
 * </pre>
 *
 * @author : tarr4h
 * @ClassName : BoardDistrictVo
 * @description :
 * @date : 2023-05-01
 */
@Getter
@Setter
public class BoardDistrictVo {

    private String boardId;
    private double latitude;
    private double longitude;
    private String region1;
    private String region2;
    private String addr;
    private String modDt;
}
