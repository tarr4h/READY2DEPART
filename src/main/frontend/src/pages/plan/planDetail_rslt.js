import PlanDoDetail from "./planDoDetail";
import PlanDoResult from "./planDoResult";
import Modal from "../comn/Modal";
import BoardDetailContent from "../board/boardDetailContent";
import {useEffect, useRef, useState} from "react";
import * as comn from "../../comn/comnFunction";
import axios from "axios";
const {kakao} = window;


function ResultPlanDetail({plan, doList, setDoList, reArranged, setReArranged}){

    const [showMap, setShowMap] = useState(false);
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

        if(plan.startLocNm !== '' && plan.startLocNm != null){
            setShowMap(true);
            void createMap();
        }
    }, [doList, availDoListLength]);

    const openBoardDetailModal = (board) => {
        selectedBoard.current = board;
        setShowBoardDetailModal(true);
    }

    const getLocationInfo = async () => {
        const param = {
            id : plan.id,
            dayId : plan.id
        }
        return await(await(axios.post('/pln/selectPlanRsltLocale', param))).data;
    }

    const createMap = async () => {
        let locale = await getLocationInfo();
        let level = comn.mapLevelRadiusMatcher(Number(locale.radius));
        let {map} = await comn.setMap('planRsltMap', locale.centralLat, locale.centralLng, false, level);
        await setOverlay(map, '출발', plan.startLocLat, plan.startLocLng);

        let prevLat = plan.startLocLat;
        let prevLng = plan.startLocLng;
        doList.forEach((planDo) => {
            if(planDo.ordr !== 9999){
                let curLat = planDo.board.district.latitude;
                let curLng = planDo.board.district.longitude;
                setOverlay(map, planDo.ordr, curLat, curLng);
                setPolyLine(map, prevLat, prevLng, curLat, curLng);
                prevLat = curLat;
                prevLng = curLng;
            }
        });
    }

    const setPolyLine = async(map, x1, y1, x2, y2) => {
        let linePath = [
            new kakao.maps.LatLng(x1, y1),
            new kakao.maps.LatLng(x2, y2)
        ];

        let polyline = new kakao.maps.Polyline({
            path: linePath,
            strokeWeight: 3,
            strokeColor: '#24232B',
            strokeOpacity: 0.9,
            strokeStyle: 'solid'
        });
        polyline.setMap(map);
    }

    const setOverlay = async (map, content, latitude, longitude) => {
        let iwContent = `
            <div class="iwContent circle">
                <div>${content}</div>
            </div>
        `;
        let iwPosition = new kakao.maps.LatLng(latitude, longitude);

        let customOverlay = new kakao.maps.CustomOverlay({
            position: iwPosition,
            content: iwContent,
            // xAnchor: 0.62,
            // yAnchor: 2
        });
        customOverlay.setMap(map);
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
        await setReArranged(true);
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
                showMap ? <div id="planRsltMap" className="map mb_3"></div> : null
            }
            {
                reArranged ? <div className="gray ml_1 mt_1 mb_1 center">순번 변경 후 저장 시 반영됩니다.</div> : ''
            }
            {
                doList.map((item, index) => (
                    <PlanDoResult key={index}
                                  number={index}
                                  planDo={item}
                                  availDoListLength={availDoListLength}
                                  changeOrdr={changeOrder}
                                  openBoardDetailModal={openBoardDetailModal}
                    />
                ))
            }
        </div>
    )
}

export default ResultPlanDetail;