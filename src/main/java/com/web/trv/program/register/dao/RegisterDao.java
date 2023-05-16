package com.web.trv.program.register.dao;

import com.web.trv.comn.model.FileVo;
import com.web.trv.comn.model.SysCodeVo;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;
import java.util.Map;

/**
 * <pre>
 * com.web.trv.program.register.dao.RegisterDao
 *  - RegisterDao.java
 * </pre>
 *
 * @author : tarr4h
 * @ClassName : RegisterDao
 * @description :
 * @date : 2023-04-23
 */
@Mapper
public interface RegisterDao {
    List<SysCodeVo> selectAddInfoList();

    List<SysCodeVo> selectBoardCategory(Map<String, Object> param);

    int insertBoard(Map<String, Object> param);

    int insertAddInfo(java.util.Map<java.lang.String,java.lang.Object> param);

    int insertFile(FileVo fileVo);

    int insertDistrictInfo(Map<String, Object> param);

}
