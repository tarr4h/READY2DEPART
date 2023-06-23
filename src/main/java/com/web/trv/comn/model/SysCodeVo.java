package com.web.trv.comn.model;

import lombok.Getter;
import lombok.Setter;

/**
 * <pre>
 * com.web.trv.comn.model.SysCodeVo
 *  - SysCodeVo.java
 * </pre>
 *
 * @author : tarr4h
 * @ClassName : SysCodeVo
 * @description :
 * @date : 2023-04-23
 */
@Getter
@Setter
public class SysCodeVo {

    private String sysCd;
    private String upSysCd;
    private String topSysCd;
    private int lvl;
    private String val;
    private String nm;
    private String modDt;
}
