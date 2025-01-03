package com.web.trv.program.district.controller;

import com.web.trv.program.district.service.DistrictService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

/**
 * <pre>
 * com.web.trv.program.district.controller.DistrictController
 *  - DistrictController.java
 * </pre>
 *
 * @author : tarr4h
 * @ClassName : DistrictController
 * @description :
 * @date : 2023-05-14
 */
@RestController
@RequestMapping("/district")
public class DistrictController {

    @Autowired
    DistrictService service;

    @GetMapping("selectRegion1")
    public ResponseEntity<?> selectRegion1(@RequestParam Map<String, Object> param){
        return ResponseEntity.ok().body(service.selectRegion1(param));
    }

    @GetMapping("selectRegion2")
    public ResponseEntity<?> selectRegion2(@RequestParam Map<String, Object> param){
        return ResponseEntity.ok().body(service.selectRegion2(param));
    }

    @GetMapping("selectType1")
    public ResponseEntity<?> selectType1(@RequestParam Map<String, Object> param){
        param.put("upSysCd", "SYS0000004");
        return ResponseEntity.ok().body(service.selectType(param));
    }

    @GetMapping("selectType2")
    public ResponseEntity<?> selectType2(@RequestParam Map<String, Object> param){
        return ResponseEntity.ok().body(service.selectType(param));
    }

    @GetMapping("selectAddInfo")
    public ResponseEntity<?> selectAddInfo(@RequestParam Map<String, Object> param){
        return ResponseEntity.ok().body(service.selectAddInfo(param));
    }

    @GetMapping("selectRegionGeoLoc")
    public ResponseEntity<?> selectRegionGeoLoc(@RequestParam Map<String, Object> param){
        return ResponseEntity.ok().body(service.selectRegionGeoLoc(param));
    }
}
