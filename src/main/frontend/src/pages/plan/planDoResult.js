

function PlanDoResult({planDo, openBoardDetailModal}){

    const showBoardDetail = () => {
        openBoardDetailModal(planDo.board);
    }

    return (
        <div className="box1 mb_1 gray">
            <div className="flex j_between">
                <div className="subTit"
                     onClick={showBoardDetail}
                >
                    <span className="orange">{planDo.board.title}</span>
                </div>
                <div className="subTit">
                    <span>{planDo.board.categoryVo.nm}</span>
                </div>
            </div>
            <div className="pl_1">
                <span>{planDo.board.summary}</span>
            </div>
            <div className="flex j_between mt_1">
                <div className="titWrapper tb wd_50">
                    <div>예정시간</div>
                    <div>
                        <span className="orange">{planDo.expectedTm == null ? '-' : planDo.expectedTm}</span>
                    </div>
                </div>
                <div className="titWrapper tb wd_50">
                    <div>머무를시간</div>
                    <div>
                        <span className="orange">{planDo.stayTmMin == null ? 0 : planDo.stayTmMin}</span>
                        <span className="addTxt">(분)</span>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default PlanDoResult;