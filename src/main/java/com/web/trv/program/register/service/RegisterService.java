package com.web.trv.program.register.service;

import com.web.trv.comn.model.FileVo;
import com.web.trv.comn.model.SysCodeVo;
import com.web.trv.program.register.dao.RegisterDao;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.io.FilenameUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.Map;

/**
 * <pre>
 * com.web.trv.program.register.service.RegisterService
 *  - RegisterService.java
 * </pre>
 *
 * @author : tarr4h
 * @ClassName : RegisterService
 * @description :
 * @date : 2023-04-23
 */
@SuppressWarnings("unchecked")
@Service
@Slf4j
public class RegisterService {

    @Autowired
    RegisterDao dao;

    @Value(value = "${spring.servlet.multipart.location}")
    String fileLocation;

    public List<SysCodeVo> selectAddInfoList() {
        return dao.selectAddInfoList();
    }

    public List<SysCodeVo> selectBoardCategory(Map<String, Object> param) {
        return dao.selectBoardCategory(param);
    }

    public String insertBoard(Map<String, Object> param) throws Exception {
        if(param.get("rating") == null || param.get("rating").equals("")){
            param.put("rating", 0);
        }
        if(param.get("categoryDetail") != null && !param.get("categoryDetail").equals("")){
            param.put("category", param.get("categoryDetail"));
        }
        String boardId = param.get("boardId") != null ? (String) param.get("boardId") : null;
        if(boardId == null){
            dao.insertBoard(param);
        } else {
            updateBoard(param);
        }

        dao.insertDistrictInfo(param);
        List<Map<String, Object>> addInfoList = (List<Map<String, Object>>) param.get("addInfoList");
        if(addInfoList.size() > 0){
            dao.insertAddInfo(param);
        }
        return boardId;
    }

    public void updateBoard(Map<String, Object> param) {
        // board update
        dao.updateBoard(param);
        deleteBoardExtra(param);
    }

    public int deleteBoard(Map<String, Object> param) {
        deleteBoardExtra(param);
        return dao.deleteBoard(param);
    }

    public void deleteBoardExtra(Map<String, Object> param){
        // 등록파일 삭제처리 >> 추후 물리적 파일 제거 필요
        dao.deleteFile(param);

        // district 삭제처리
        dao.deleteDistractInfo(param);

        // addinfo 삭제처리
        dao.deleteAddInfo(param);
    }

    public int insertFile(MultipartFile[] fileList, String boardId) throws IOException {
        // 개발용 파일 경로 설정
//        String pathDivider = "\\"; // window
        String pathDivider = "/"; // mac
        Path dir = Paths.get(fileLocation + pathDivider + boardId);
        Files.createDirectories(dir);

        int cnt = 1;
        for(MultipartFile file : fileList){
            String ofn = file.getOriginalFilename();
            if(ofn == null) throw new IOException("파일명이 없습니다.");
            String type = FilenameUtils.getExtension(new File(ofn).getName());

            String rfn = boardId + "_" + cnt + "." + type;
            cnt++;

            Path filePath = dir.resolve(rfn).normalize();
            file.transferTo(filePath);

            double fileSize = (double) Math.round((double)file.getSize()/1000/1000*10)/10;

            FileVo fileVo = new FileVo();
            fileVo.setRefId(boardId);
            fileVo.setOfn(ofn);
            fileVo.setRfn(rfn);
            fileVo.setType(type);
            fileVo.setSize(fileSize);
            fileVo.setDir(filePath.toString());

            dao.insertFile(fileVo);
        }

        return cnt;
    }

}
