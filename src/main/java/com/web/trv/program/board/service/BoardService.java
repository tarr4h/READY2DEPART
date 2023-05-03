package com.web.trv.program.board.service;

import com.web.trv.program.board.dao.BoardDao;
import com.web.trv.program.board.model.BoardVo;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

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
}
