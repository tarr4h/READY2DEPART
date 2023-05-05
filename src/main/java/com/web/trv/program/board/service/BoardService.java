package com.web.trv.program.board.service;

import com.web.trv.comn.model.FileVo;
import com.web.trv.program.board.dao.BoardDao;
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
import java.util.List;
import java.util.Map;

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
        log.debug("img = {}", img);

        Path path = Paths.get(img.getDir());

        HttpHeaders headers = new HttpHeaders();
        headers.add(HttpHeaders.CONTENT_TYPE, "image/jpeg");

        Resource resource = new InputStreamResource(Files.newInputStream(path));

        return new ResponseEntity<>(resource, headers, HttpStatus.OK);
    }
}
