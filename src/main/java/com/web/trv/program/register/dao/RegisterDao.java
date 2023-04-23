package com.web.trv.program.register.dao;

import com.web.trv.comn.model.SysCodeVo;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

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
}
