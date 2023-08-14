import PlanDoDetail from "./planDoDetail";
import {useEffect, useLayoutEffect, useRef, useState} from "react";
import Modal from "../comn/Modal";
import FindLocModal from "../comn/findLocModal";
import BoardDetailContent from "../board/boardDetailContent";


function EditPlanDetail({plan, doList, setDoList, register, setValue, stayTmList, setStayTmList}){

    const [showSearchModal, setShowSearchModal] = useState(false);
    const [showBoardDetailModal, setShowBoardDetailModal] = useState(false);
    const selectedBoard = useRef(null);
    const [availDoListLength, setAvailDoListLength] = useState(doList.length);

    useEffect(() => {
        let cnt = 0;
        doList.forEach((item, index) => {
            if(item.stayTmMin !== 0){
                cnt++;
            }
        });
        setAvailDoListLength(cnt);
    }, [doList, availDoListLength]);

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

    const changeOrder = async (ordr, direction) => {
        const index = ordr - 1;
        const planDo = doList[index];

        // 변수를 새로운 memory 올리기
        let newDoList = [];
        doList.forEach((item, ind) => {
            newDoList.push(item);
        });

        newDoList.splice(index, 1);
        if(direction){
            // up
            if(index === 1){
                newDoList.unshift(planDo);
            } else {
                await (newDoList.forEach((item, ind) => {
                    if(ind === index - 1){
                        newDoList.splice(ind, 0, planDo);
                    }
                }));
            }

        } else {
            // down
            newDoList.splice(ordr, 0, planDo);
        }

        // 완성 후 ordr 재정렬
        newDoList.forEach((item, ind) => {
            if(item.stayTmMin != null && item.stayTmMin !== 0){
                item.ordr = ind + 1;
            }
        });
        await setDoList(newDoList);
        console.log('after doList : ', newDoList);

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
                    <div>제목</div>
                    <div>
                        <input type="text"
                               className="input wd_100"
                               name="nm"
                               defaultValue={plan.nm}
                               {...register('nm')}
                        />
                    </div>
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
                {
                    doList.map((item, index) => (
                        <PlanDoDetail key={index}
                                      planDo={item}
                                      availDoListLength={availDoListLength}
                                      openBoardDetailModal={openBoardDetailModal}
                                      stayTmList={stayTmList}
                                      setStayTmList={setStayTmList}
                                      changeOrdr={changeOrder}
                        />
                    ))
                }
            </div>
        </div>
    )
}

export default EditPlanDetail;