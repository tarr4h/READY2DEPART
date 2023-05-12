import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import * as comn from "../../comn/comnFunction";

function Board({board}){

    const navigate = useNavigate();
    const [extraInfo, setExtraInfo] = useState(false);

    const appendAll = () => {
        setExtraInfo(true);
    }

    const showDetail = () => {
        navigate('/main/boardDetail', {
            state : {
                board : board
            }
        });
    }

    const regionColor = (region) => {
        let regionClass;
        switch(region){
            case '서울' :
                regionClass = 'region_col_seoul';
                break;
            case '경기' :
                regionClass = 'region_col_gynggi';
                break;
            case '제주' :
                regionClass = 'region_col_jeju';
                break;
        }

        return regionClass;
    }

    return (
        <div className="board">
            <div className="flex-left">
                <div className="top">
                    <img className="boardCtgrThumbnail" src={comn.imgGend(board.categorySysCd)} alt="food"/>
                    <span className="title"
                          onClick={showDetail}
                    >{board.title}</span>
                </div>
                <div className="bottom">
                    <div>
                        {board.addInfoList.map((addInfo, index) => (
                            (index < 2 ? <div key={index}>{addInfo.sysCdNm}</div>
                                : (index === 2 ?
                                    <div key={index}>
                                        <div
                                             onClick={appendAll}
                                             style={extraInfo ? {display : 'none'} : {display:'inherit'}}
                                        >
                                            + {board.addInfoList.length - 2}
                                        </div>
                                        <div
                                             style={extraInfo ? {display:'inherit'} : {display:'none'}}
                                        >
                                            {addInfo.sysCdNm}
                                        </div>
                                    </div>
                                        : <div key={index}
                                               style={extraInfo ? {display:'inherit'} : {display:'none'}}
                                               >
                                            {addInfo.sysCdNm}
                                          </div>))
                        ))}
                    </div>
                    <div>
                        <span>{board.summary}</span>
                    </div>
                </div>
            </div>
            <div className="flex-right">
                <div className="top">
                    <div className="regionWrapper">
                        <div className={regionColor(board.district.region1)}>{board.district.region1}</div>
                        <div className={regionColor(board.district.region1)}>{board.district.region2}</div>
                    </div>
                </div>
                <div className="bottom">
                    <span>2023-05-01</span>
                </div>
            </div>
        </div>
    )
}

export default Board;