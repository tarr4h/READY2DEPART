package com.web.trv.program.register.controller;

import com.web.trv.comn.model.SysCodeVo;
import com.web.trv.program.register.service.RegisterService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Map;

/**
 * <pre>
 * com.web.trv.program.register.controller.RegisterController
 *  - RegisterController.java
 * </pre>
 *
 * @author : tarr4h
 * @ClassName : RegisterController
 * @description :
 * @date : 2023-04-23
 */
@RestController
@RequestMapping("/register")
@Slf4j
public class RegisterController {

    @Autowired
    RegisterService service;

    @GetMapping("selectAddInfoList")
    public ResponseEntity<?> selectAddInfoList(){
        List<SysCodeVo> list = service.selectAddInfoList();
        return ResponseEntity.ok().body(list);
    }

    @GetMapping("selectBoardCategory")
    public ResponseEntity<?> selectBoardCategory(){
        List<SysCodeVo> list = service.selectBoardCategory();
        return ResponseEntity.ok().body(list);
    }

    @PostMapping("insertBoard")
    public ResponseEntity<?> insertBoard(@RequestBody Map<String, Object> param){
        return ResponseEntity.ok().body(service.insertBoard(param));
    }

    @PostMapping(value = "insertFile")
    public ResponseEntity<?> insertFile(@RequestParam(value="file", required = false) MultipartFile[] fileList, String boardId) throws IOException {
        int result = service.insertFile(fileList, boardId);
        return ResponseEntity.ok().body(false);
    }
}
