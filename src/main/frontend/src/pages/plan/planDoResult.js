import RoundImgIco from "../comn/roundImgIco";


function PlanDoResult({planDo, availDoListLength, number, openBoardDetailModal, changeOrdr}){

    const showBoardDetail = () => {
        openBoardDetailModal(planDo.board);
    }

    const toUp = () => {
        changeOrdr(planDo.ordr, true);
    }

    const toDown = () => {
        changeOrdr(planDo.ordr, false);
    }

    return (
        <div className="box1 mb_1 gray">
            <div className="flex j_between pr_1 pl_1">
                <div className="subTit"
                     onClick={showBoardDetail}
                >
                    <span className={planDo.stayTmMin != null && planDo.stayTmMin !== 0 ? 'orange' : ''}>
                        {planDo.stayTmMin != null && planDo.stayTmMin !== 0 ? number + 1 + '. ' : ''}{planDo.board.title}
                    </span>
                </div>
                <div className="subTit">
                    <span>{planDo.board.categoryVo.nm}</span>
                </div>
            </div>
            <div className="pl_2 flex j_between">
                <span>{planDo.board.summary}</span>
                {
                    planDo.ordr !== 9999 ? (
                        <div className="flex">
                            {
                                planDo.ordr !== 1 ? (
                                    <RoundImgIco img={'angle-double-small-up.png'}
                                                 onClick={toUp}
                                    />
                                ) : null
                            }
                            {
                                planDo.ordr !== availDoListLength ? (
                                    <RoundImgIco img={'angle-double-small-down.png'}
                                                 onClick={toDown}
                                    />
                                ) : null
                            }
                        </div>
                    ) : null
                }
            </div>
            <div className="flex j_between mt_1">
                <div className="titWrapper tb wd_50">
                    <div>이동시간</div>
                    <div>
                        <span className="orange">{planDo.travelTmMin == null ? 0 : planDo.travelTmMin}</span>
                        <span className="addTxt">(분)</span>
                    </div>
                </div>
                <div className="titWrapper tb wd_50">
                    <div>도착시간</div>
                    <div>
                        <span className="orange">{planDo.expectedTm == null ? '-' : planDo.expectedTm}</span>
                    </div>
                </div>
            </div>
            <div className="flex j_between">
                <div className="titWrapper tb wd_50">
                    <div>머무를시간</div>
                    <div>
                        <span className="orange">{planDo.stayTmMin == null ? 0 : planDo.stayTmMin}</span>
                        <span className="addTxt">(분)</span>
                    </div>
                </div>

                <div className="titWrapper tb wd_50">
                    <div>출발시간</div>
                    <div>
                        <span className="orange">{planDo.departTm == null ? '-' : planDo.departTm}</span>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default PlanDoResult;