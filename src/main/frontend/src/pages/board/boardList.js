import {useEffect, useState} from "react";
import '../../css/Board.css';
import Board from "./board";
import {useNavigate} from "react-router-dom";
import {findAllByDisplayValue} from "@testing-library/react";

function BoardList({boardList, isTracking}){

    const navigate = useNavigate();
    const [boardSummary, setBoardSummary] = useState([]);
    const [selectedCtgrArr, setSelectedCtgrArr] = useState([]);
    const [wholeCtgrChecked, setWholeCtgrChecked] = useState(true);

    useEffect(() => {
        void setSummary();
        if(isTracking){
            setWholeCtgrChecked(current => current = true);
        }
    }, [boardList]);

    function goRegister(){
        navigate('/my/register');
    }

    const setSummary = async() => {
        const ctgrArr = [];
        const selectedArr = [];

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

                let selected = {
                    categoryCd : category,
                    checked : true
                }
                selectedArr.push(selected);
            }
        });

        setBoardSummary(ctgrArr);
        setSelectedCtgrArr(selectedArr);
    }

    const ctgrChkboxOnchange = (event) => {
        const checked = event.target.checked;
        const categoryCd = event.target.value;
        const arr = [];

        if(checked){
            let param = {
                categoryCd,
                checked
            }
            arr.push(param);

            selectedCtgrArr.forEach(function(item, index){
                arr.push(item);
            });
        } else {
            selectedCtgrArr.forEach(function(item, index){
                if(item.categoryCd !== categoryCd){
                    arr.push(item);
                }
            });
        }
        if(boardSummary.length === arr.length){
            setWholeCtgrChecked(current => !current);
        } else if(boardSummary.length !== arr.length && wholeCtgrChecked){
            setWholeCtgrChecked(current => !current);
        }
        setSelectedCtgrArr(arr);
    }

    const clearCtgrArr = (event) => {
        const checked = event.target.checked;
        const arr = [];
        if(checked){
            boardSummary.forEach((item, index) => {
                const param = {
                    categoryCd : item.category,
                    checked : true
                }
               arr.push(param);
            });
        }
        setWholeCtgrChecked(current => !current);
        setSelectedCtgrArr(arr);
    }

    const chkContainCtgr = (category) => {
        let result = false;
        selectedCtgrArr.forEach((item, index) => {
            if(item.categoryCd === category){
                result = true;
            }
        })
        return result;
    }

    return(
        <div className="boardWrapper">
            <a className="btn goRegister" onClick={goRegister}>등록하기</a>
            <div className="boardResultSummary">
                <div>
                    검색결과
                </div>
                <div>
                    <div className="chkbox_multi orange">
                        <input type="checkbox"
                               id="tot"
                               onChange={clearCtgrArr}
                               checked={wholeCtgrChecked}
                               value=""
                        />
                        <label htmlFor="tot">전체({boardList.length})</label>
                    </div>
                    {boardSummary.map((item, index) => (
                        <div className="chkbox_multi" key={index}>
                            <input type="checkbox"
                                   id={item.category}
                                   checked={chkContainCtgr(item.category)}
                                   onChange={ctgrChkboxOnchange}
                                   value={item.category}
                            />
                            <label htmlFor={item.category}>{item.nm}({item.cnt})</label>
                        </div>
                    ))}
                </div>
            </div>
            {boardList.map((board, index) => (
                <Board key={board.id}
                       board={board}
                       selectedCtgrArr={selectedCtgrArr}
                />
            ))}
        </div>
    )

}

export default BoardList;