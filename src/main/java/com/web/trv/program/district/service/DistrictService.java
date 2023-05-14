package com.web.trv.program.district.service;

import com.web.trv.program.district.dao.DistrictDao;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Map;

/**
 * <pre>
 * com.web.trv.program.district.service.DistrictService
 *  - DistrictService.java
 * </pre>
 *
 * @author : tarr4h
 * @ClassName : DistrictService
 * @description :
 * @date : 2023-05-14
 */
@Service
@Slf4j
public class DistrictService {

    @Autowired
    DistrictDao dao;

    public Object selectRegion1(Map<String, Object> param) {
        return dao.selectRegion1(param);
    }

    public Object selectRegion2(Map<String, Object> param) {
        return dao.selectRegion2(param);
    }
}
