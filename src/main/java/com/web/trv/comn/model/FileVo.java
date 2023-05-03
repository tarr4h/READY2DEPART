package com.web.trv.comn.model;

import lombok.Getter;
import lombok.Setter;

/**
 * <pre>
 * com.web.trv.comn.model.FileVo
 *  - FileVo.java
 * </pre>
 *
 * @author : tarr4h
 * @ClassName : FileVo
 * @description :
 * @date : 2023-04-30
 */

@Getter
@Setter
public class FileVo {

    private String id;
    private String refId;
    private String ofn;
    private String rfn;
    private String type;
    private double size;
    private String dir;
    private String modDt;
}
