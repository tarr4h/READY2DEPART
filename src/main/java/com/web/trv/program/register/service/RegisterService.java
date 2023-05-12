package com.web.trv.program.register.service;

import com.web.trv.comn.model.FileVo;
import com.web.trv.comn.model.SysCodeVo;
import com.web.trv.program.register.dao.RegisterDao;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.compress.compressors.FileNameUtil;
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

    public List<SysCodeVo> selectBoardCategory() {
        return dao.selectBoardCategory();
    }

    public String insertBoard(Map<String, Object> param) {
        dao.insertBoard(param);
        String boardId = (String) param.get("boardId");

        dao.insertDistrictInfo(param);
        List<Map<String, Object>> addInfoList = (List<Map<String, Object>>) param.get("addInfoList");
        if(addInfoList.size() > 0){
            dao.insertAddInfo(param);
        }
        return boardId;
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
