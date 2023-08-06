import PlanDoDetail from "./planDoDetail";
import PlanDoResult from "./planDoResult";
import Modal from "../comn/Modal";
import BoardDetailContent from "../board/boardDetailContent";
import {useEffect, useRef, useState} from "react";
import * as comn from "../../comn/comnFunction";
import axios from "axios";
const {kakao} = window;


function ResultPlanDetail({plan, doList}){

    const [showMap, setShowMap] = useState(false);
    const [showBoardDetailModal, setShowBoardDetailModal] = useState(false);
    const selectedBoard = useRef(null);

    useEffect(() => {
        console.log('doList : ', doList);
        if(plan.startLocNm !== '' && plan.startLocNm != null){
            setShowMap(true);
            void createMap();
        }
    }, [doList]);

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