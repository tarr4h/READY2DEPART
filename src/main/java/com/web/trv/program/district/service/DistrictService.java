package com.web.trv.program.district.service;

import com.web.trv.comn.util.CalcDistance;
import com.web.trv.program.board.model.BoardDistrictVo;
import com.web.trv.program.district.dao.DistrictDao;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Calendar;
import java.util.HashMap;
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

    public Object selectType(Map<String, Object> param) {
        return dao.selectType(param);
    }

    public Object selectRegionGeoLoc(Map<String, Object> param) {
        List<BoardDistrictVo> districtList = dao.selectBoardDistrict(param);

        double minLat = 0;
        double maxLat = 0;
        double minLng = 0;
        double maxLng = 0;
        for(BoardDistrictVo district : districtList){
            if(minLat == 0 || district.getLatitude() < minLat) {
                minLat = district.getLatitude();
            }
            if(district.getLatitude() > maxLat) {
                maxLat = district.getLatitude();
            }
            if(minLng == 0 || district.getLongitude() < minLng){
                minLng = district.getLongitude();
            }
            if(district.getLongitude() > maxLng){
                maxLng = district.getLongitude();
            }
        }

        double centralLat = (minLat + maxLat) / 2;
        double centralLng = (minLng + maxLng) / 2;

        double radius = Math.ceil(CalcDistance.getSqrtDistance(centralLat, centralLng, maxLat, maxLng));

        Map<String, Object> returnMap = new HashMap<>();
        Map<String, Object> geoLoc = new HashMap<>();
        geoLoc.put("latitude", centralLat);
        geoLoc.put("longitude", centralLng);
        returnMap.put("geoLoc", geoLoc);
        returnMap.put("radius", radius);

        return returnMap;
    }


}
