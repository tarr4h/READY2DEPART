import PlanDoDetail from "./planDoDetail";
import PlanDoResult from "./planDoResult";
import Modal from "../comn/Modal";
import BoardDetailContent from "../board/boardDetailContent";
import {useRef, useState} from "react";


function ResultPlanDetail({plan, doList}){

    const [showBoardDetailModal, setShowBoardDetailModal] = useState(false);
    const selectedBoard = useRef(null);

    const openBoardDetailModal = (board) => {
        selectedBoard.current = board;
        setShowBoardDetailModal(true);
    }

    return (
        <div>
            {
                showBoardDetailModal ?
                    (
                        <Modal title={'상세보기'}
                               content={<BoardDetailContent board={selectedBoard.current}
                                                            modal={true}
                               />}
                               isOpen={showBoardDetailModal}
                               setIsOpen={setShowBoardDetailModal}
                        />
                    )
                    :
                    ''
            }
            <div className="box1 bd_gray mb_3">
                <div className="titWrapper tb">
                    <div>시작시간</div>
                    <div>
                        <span className="orange">{plan.startTm}</span>
                    </div>
                </div>
                <div className="titWrapper tb">
                    <div>종료시간</div>
                    <div>
                        <span className="orange">{plan.endTm}</span>
                    </div>
                </div>
                <div className="titWrapper tb">
                    <div>출발위치</div>
                    <div>
                        <span className="orange">{plan.startLocNm === null ? '미지정' : plan.startLocNm}</span>
                    </div>
                </div>
            </div>
            {
                doList.map((item, index) => (
                    <PlanDoResult key={index}
                                  number={index}
                                  planDo={item}
                                  openBoardDetailModal={openBoardDetailModal}
                    />
                ))
            }
        </div>
    )
}

export default ResultPlanDetail;