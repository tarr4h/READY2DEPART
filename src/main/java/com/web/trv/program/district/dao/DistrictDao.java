package com.web.trv.program.district.dao;

import com.web.trv.comn.model.SysCodeVo;
import com.web.trv.program.board.model.BoardDistrictVo;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;
import java.util.Map;

/**
 * <pre>
 * com.web.trv.program.district.dao.DistrictDao
 *  - DistrictDao.java
 * </pre>
 *
 * @author : tarr4h
 * @ClassName : DistrictDao
 * @description :
 * @date : 2023-05-14
 */
@Mapper
public interface DistrictDao {
    List<String> selectRegion1(Map<String, Object> param);

    List<String> selectRegion2(Map<String, Object> param);

    List<SysCodeVo> selectType(Map<String, Object> param);

    List<BoardDistrictVo> selectBoardDistrict(Map<String, Object> param);

    List<SysCodeVo> selectAddInfo(Map<String, Object> param);
}
