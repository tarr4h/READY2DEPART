package com.web.trv.program.board.model;

import com.web.trv.comn.model.FileVo;
import com.web.trv.comn.model.SysCodeVo;
import lombok.Getter;
import lombok.Setter;

import java.util.Comparator;
import java.util.List;

/**
 * <pre>
 * com.web.trv.program.board.model.Board
 *  - Board.java
 * </pre>
 *
 * @author : tarr4h
 * @ClassName : Board
 * @description :
 * @date : 2023-05-01
 */
@Getter
@Setter
public class BoardVo implements Comparable<BoardVo> {

    private String id;
    private String title;
    private String summary;
    private String content;
    private String category;
    private int rating;
    private String modDt;

    private BoardDistrictVo district;
    private List<AddInfoVo> addInfoList;
    private List<FileVo> fileList;
    private SysCodeVo categoryVo;
    private SysCodeVo upCategoryVo;

    @Override
    public int compareTo(BoardVo board) {
        if(this.district.getToDistance() < board.district.getToDistance()){
            return -1;
        } else if(this.district.getToDistance() == board.district.getToDistance()){
            return 0;
        } else {
            return 1;
        }
    }
}
