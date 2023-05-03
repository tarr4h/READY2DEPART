package com.web.trv.program.board.controller;

import com.web.trv.program.board.service.BoardService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

/**
 * <pre>
 * com.web.trv.program.board.controller.BoardController
 *  - BoardController.java
 * </pre>
 *
 * @author : tarr4h
 * @ClassName : BoardController
 * @description :
 * @date : 2023-05-01
 */

@RestController
@Slf4j
@RequestMapping("/board")
public class BoardController {

    @Autowired
    BoardService service;

    @GetMapping("selectBoardList")
    public ResponseEntity<?> selectBoardList(@RequestParam Map<String, Object> param){
        return ResponseEntity.ok().body(service.selectBoardList(param));
    }
}
