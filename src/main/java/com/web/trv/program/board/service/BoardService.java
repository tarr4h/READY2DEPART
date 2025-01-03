package com.web.trv.program.board.service;

import com.web.trv.comn.model.FileVo;
import com.web.trv.comn.util.CalcDistance;
import com.web.trv.program.board.dao.BoardDao;
import com.web.trv.program.board.model.BoardDistrictVo;
import com.web.trv.program.board.model.BoardVo;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.InputStreamResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.*;

/**
 * <pre>
 * com.web.trv.program.board.service.BoardService
 *  - BoardService.java
 * </pre>
 *
 * @author : tarr4h
 * @ClassName : BoardService
 * @description :
 * @date : 2023-05-01
 */
@Service
@Slf4j
public class BoardService {

    @Autowired
    BoardDao dao;


    public List<BoardVo> selectBoardList(Map<String, Object> param) {
        return dao.selectBoardList(param);
    }

    public ResponseEntity<Resource> imgView(String refId, String id) throws IOException {
        FileVo img = dao.getFile(refId, id);
        Path path = Paths.get(img.getDir());

        HttpHeaders headers = new HttpHeaders();
        headers.add(HttpHeaders.CONTENT_TYPE, "image/jpeg");

        Resource resource = new InputStreamResource(Files.newInputStream(path));

        return new ResponseEntity<>(resource, headers, HttpStatus.OK);
    }

    @SuppressWarnings("unchecked")
    public List<BoardVo> selectNearby(Map<String, Object> param) {
        log.debug(" param = {}", param);
        List<String> addInfoList = (List<String>) param.get("addInfoList");
        if(addInfoList != null && addInfoList.size() != 0){
            param.put("addInfoListSize", addInfoList.size());
        }

        double latitude = Double.parseDouble(String.valueOf(param.get("latitude")));
        double longitude = Double.parseDouble(String.valueOf(param.get("longitude")));
        int maxDistance = Integer.parseInt(String.valueOf(param.get("maxDistance")));

        List<BoardVo> availList = new ArrayList<>();
        List<BoardVo> boardList = dao.selectBoardList(param);
        for(BoardVo board : boardList){
            BoardDistrictVo district = board.getDistrict();
            double distance = CalcDistance.calculateArea(latitude, longitude, district.getLatitude(), district.getLongitude());
            district.setToDistance(distance);
            if(distance < maxDistance){
                availList.add(board);
            }
        }

        Collections.sort(availList);
        return availList;
    }
}
