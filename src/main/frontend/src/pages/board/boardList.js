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
                if(board.category === ctgr.category) {
                    ctgr.cnt += 1;
                    result = true;
                }
            });
            if(!result) ctgrArr.push({
                category : board.category,
                nm : board.categorySysCd.nm,
                cnt : 1
            });
        });

        setBoardSummary(ctgrArr);
    }

    return(
        <div className="boardWrapper">
            <a className="btn goRegister" onClick={goRegister}>등록하기</a>
            <div className="boardResultSummary">
                <div>
                    검색결과 : {boardList.length}건
                </div>
                <div>
                    {boardSummary.map((item, index) => (
                        <div key={index}>{item.nm} : {item.cnt}</div>
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