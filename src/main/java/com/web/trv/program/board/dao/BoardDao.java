package com.web.trv.program.board.dao;

import com.web.trv.program.board.model.BoardVo;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;
import java.util.Map;

/**
 * <pre>
 * com.web.trv.program.board.dao.BoardDao
 *  - BoardDao.java
 * </pre>
 *
 * @author : tarr4h
 * @ClassName : BoardDao
 * @description :
 * @date : 2023-05-01
 */
@Mapper
public interface BoardDao {

    List<BoardVo> selectBoardList(Map<String, Object> param);
}
