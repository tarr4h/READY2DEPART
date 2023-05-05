import {useEffect, useState} from "react";

function Board({board}){

    const [extraInfo, setExtraInfo] = useState(false);

    function imgGend(sysCd){
        let img = '';
        switch(sysCd.val){
            case 'FOOD' : img = 'sushi.png';break;
            case 'ACCOMMODATION' : img = 'accomodation.png';break;
            case 'CAFE' : img = 'cafe.png';break;
            default : img = 'question.png';break;
        }

        return require(`../../img/${img}`);
    }

    const appendAll = () => {
        setExtraInfo(true);
    }

    return (
        <div className="board">
            <div className="flex-left">
                <div className="top">
                    <img className="boardCtgrThumbnail" src={imgGend(board.categorySysCd)} alt="food"/>
                    <span className="title">   {board.title}</span>
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
                        <div>{board.district.region1}</div>
                        <div>{board.district.region2}</div>
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