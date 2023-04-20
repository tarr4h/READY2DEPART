package com.web.trv.auth.model;

import lombok.Getter;
import lombok.Setter;

/**
 * <pre>
 * com.web.trv.auth.model.UserVo
 *  - UserVo.java
 * </pre>
 *
 * @author : tarr4h
 * @ClassName : UserVo
 * @description :
 * @date : 2023-04-19
 */
@Getter
@Setter
public class UserVo {

    private String id;
    private String userId;
    private String pwd;
    private String ph;
    private String modDt;
}
