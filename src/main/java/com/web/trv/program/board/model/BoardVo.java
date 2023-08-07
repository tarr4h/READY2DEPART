package com.web.trv.program.board.model;

import com.web.trv.auth.model.UserVo;
import com.web.trv.comn.model.FileVo;
import com.web.trv.comn.model.SysCodeVo;
import com.web.trv.comn.util.Utilities;
import lombok.Getter;
import lombok.Setter;

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
    private String userId;
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

    public boolean getIsMine(){
        UserVo loginUser = Utilities.getLoginUser();
        if(loginUser != null && this.getUserId().equals(loginUser.getId())){
            return true;
        } else {
            return false;
        }
    }

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
