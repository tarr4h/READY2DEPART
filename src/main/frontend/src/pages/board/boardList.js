import {useEffect, useState} from "react";
import '../../css/Board.css';
import Board from "./board";
import {useNavigate} from "react-router-dom";
import {findAllByDisplayValue} from "@testing-library/react";

function BoardList({boardList}){

    const navigate = useNavigate();
    const [boardSummary, setBoardSummary] = useState([]);

    useEffect(() => {
        setSummary();
    }, [boardList]);

    function goRegister(){
        navigate('/my/register');
    }

    function setSummary(){
        const ctgrArr = [];

        boardList.forEach((board) => {
            let result = false;
            ctgrArr.forEach((ctgr) => {
                if(board.upCategoryVo.lvl === 1){
                    if(board.categoryVo.sysCd === ctgr.category) {
                        ctgr.cnt += 1;
                        result = true;
                    }
                } else if(board.upCategoryVo.lvl === 2){
                    if(board.upCategoryVo.sysCd === ctgr.category){
                        ctgr.cnt += 1;
                        result = true;
                    }
                }
            });
            if(!result){
                let nm = board.upCategoryVo.lvl === 1 ? board.categoryVo.nm : board.upCategoryVo.nm;
                let category = board.upCategoryVo.lvl === 1 ? board.category : board.upCategoryVo.sysCd;

                ctgrArr.push({
                    category : category,
                    nm : nm,
                    cnt : 1
                });
            }
        });

        setBoardSummary(ctgrArr);
    }

    return(
        <div className="boardWrapper">
            <a className="btn goRegister" onClick={goRegister}>등록하기</a>
            <div className="boardResultSummary">
                <div>
                    검색결과
                </div>
                <div>
                    <div className="chkbox_multi">
                        <input type="checkbox" id="tot"/>
                        <label htmlFor="tot">전체({boardList.length})</label>
                    </div>
                    {boardSummary.map((item, index) => (
                        <div className="chkbox_multi" key={index}>
                            <input type="checkbox" id={item.category}/>
                            <label htmlFor={item.category}>{item.nm}({item.cnt})</label>
                        </div>
                    ))}
                </div>
            </div>
            {boardList.map((board, index) => (
                <Board key={board.id} board={board}/>
            ))}
        </div>
    )

}

export default BoardList;