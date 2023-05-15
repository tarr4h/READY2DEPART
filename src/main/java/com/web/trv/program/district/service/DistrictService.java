package com.web.trv.program.district.service;

import com.web.trv.program.board.model.BoardDistrictVo;
import com.web.trv.program.district.dao.DistrictDao;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
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

    public Object selectRegionGeoLoc(Map<String, Object> param) {
        // 1. region1, region2 에 속한 board district 구해오기
        List<BoardDistrictVo> districtList = dao.selectBoardDistrict(param);

        // 2. list 중 최대/최소값 구해오기 (list size > 0)

        // 3. 중심좌표 구하기

        // 4. 중심좌표와 (maxLat, maxLng)을 비교하여 radius 구하기


        return null;
    }
}
