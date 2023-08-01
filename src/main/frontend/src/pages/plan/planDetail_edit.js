import PlanDoDetail from "./planDoDetail";
import {useEffect, useRef, useState} from "react";
import Modal from "../comn/Modal";
import FindLocModal from "../comn/findLocModal";
import BoardDetailContent from "../board/boardDetailContent";


function EditPlanDetail({plan, doList, register, setValue, stayTmList, setStayTmList}){

    const [showSearchModal, setShowSearchModal] = useState(false);
    const [showBoardDetailModal, setShowBoardDetailModal] = useState(false);
    const selectedBoard = useRef(null);

    const openSearchModal = () => {
        setShowSearchModal(true);
    }

    const openBoardDetailModal = (board) => {
        selectedBoard.current = board;
        setShowBoardDetailModal(true);
    }

    const getStartLoc = (data) => {
        setValue('startLocNm', data.locNm);
        setValue('startLocLat', data.geoLoc.latitude);
        setValue('startLocLng', data.geoLoc.longitude);
        setShowSearchModal(false);
    }

    return (
        <div>
            <Modal title={'출발위치 검색'}
                   content={<FindLocModal callback={getStartLoc}
                                          showModal={showSearchModal}
                            />}
                   isOpen={showSearchModal}
                   setIsOpen={setShowSearchModal}
            />
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
            <div className="box1 bd_gray">
                <div className="subTit orange">
                    <span>기본설정</span>
                </div>
                <div className="titWrapper">
                    <div>시작시간</div>
                    <div>
                        <input type="time"
                               className="input wd_100"
                               defaultValue={plan.startTm}
                               {...register('startTm')}
                               name="startTm"/>
                    </div>
                </div>
                <div className="titWrapper">
                    <div>종료시간</div>
                    <div>
                        <input type="time"
                               className="input wd_100"
                               defaultValue={plan.endTm}
                               {...register('endTm')}
                               name="endTm"/>
                    </div>
                </div>
                <div className="titWrapper">
                    <div>출발위치</div>
                    <div>
                        <div className="flex">
                            <input type="text"
                                   className="input wd_90"
                                   defaultValue={plan.startLocNm}
                                   {...register('startLocNm')}
                                   name="startLocNm"
                                   readOnly={true}
                            />
                            <input type="hidden"
                                   defaultValue={plan.startLocLat}
                                   {...register('startLocLat')}/>
                            <input type="hidden"
                                   defaultValue={plan.startLocLng}
                                   {...register('startLocLng')}/>
                            <a className="btn bd_orange orange ml_1"
                               onClick={openSearchModal}
                            >검색</a>
                        </div>
                    </div>
                </div>
            </div>
            <div className="box1 bd_gray mt_3">
                <div className="subTit orange">
                    <span>장소목록</span>
                </div>
                <div>
                    {
                        doList.map((item, index) => (
                            <PlanDoDetail key={index}
                                          planDo={item}
                                          openBoardDetailModal={openBoardDetailModal}
                                          stayTmList={stayTmList}
                                          setStayTmList={setStayTmList}
                            />
                        ))
                    }
                </div>
            </div>
        </div>
    )
}

export default EditPlanDetail;