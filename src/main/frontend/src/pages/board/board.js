import {useEffect} from "react";

function Board({board}){

    return (
        <div className="board">
            <div className="flex-left">
                <div className="top">
                    <span className="title">{board.title}</span>
                </div>
                <div className="bottom">
                    <div>
                        {board.addInfoList.map((addInfo, index) => (
                            (index < 2 ? <div key={index}><span>{addInfo.sysCodeNm}</span></div>
                                : (index === 2 ?
                                    <div key={index}><span>+ {board.addInfoList.length - 2}</span></div> : ''))
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