package com.web.trv.comn.model;

import org.springframework.jdbc.support.JdbcUtils;

import java.util.HashMap;

/**
 * <pre>
 * com.web.trv.comn.model.Tmap
 *  - Tmap.java
 * </pre>
 *
 * @author : tarr4h
 * @ClassName : Tmap
 * @description :
 * @date : 2023-04-20
 */

public class Tmap extends HashMap {

    @Override
    public Object put(Object key, Object value) {
        return super.put(JdbcUtils.convertUnderscoreNameToPropertyName((String) key), value);
    }
}
