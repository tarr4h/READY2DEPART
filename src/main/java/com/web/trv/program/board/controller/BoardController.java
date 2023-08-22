package com.web.trv.program.board.controller;

import com.web.trv.program.board.service.BoardService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
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

    @GetMapping("imgView/{refId}/{id}")
    public ResponseEntity<Resource> imgView(@PathVariable String refId, @PathVariable String id) throws IOException {
        return service.imgView(refId, id);
    }

//    @GetMapping("selectNearby")
//    public ResponseEntity<?> selectNearby(@RequestParam Map<String, Object> param){
//        return ResponseEntity.ok().body(service.selectNearby(param));
//    }

    @PostMapping("selectNearby")
    public ResponseEntity<?> selectNearby(@RequestBody Map<String, Object> param){
        return ResponseEntity.ok().body(service.selectNearby(param));
    }

}
