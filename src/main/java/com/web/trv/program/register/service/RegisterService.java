package com.web.trv.program.register.service;

import com.web.trv.comn.model.SysCodeVo;
import com.web.trv.program.register.dao.RegisterDao;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

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
@Service
@Slf4j
public class RegisterService {

    @Autowired
    RegisterDao dao;

    public List<SysCodeVo> selectAddInfoList() {
        return dao.selectAddInfoList();
    }

    public int insertFile(MultipartFile[] fileList) {
        for(MultipartFile file : fileList){
            String ofn = file.getOriginalFilename();
            log.debug("ofn = {}", ofn);
        }

        return 0;
    }
}
