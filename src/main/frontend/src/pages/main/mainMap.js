import '../../css/mainMap.css';
import {useCallback, useEffect, useRef, useState} from "react";
import * as comn from "../../comn/comnFunction";
import axios from "axios";
import {useNavigate} from "react-router-dom";
import UpdownNum from "./updownNum";
const {kakao} = window;


function MainMap(){

    const navigate = useNavigate();
    const [mapList, setMapList] = useState([]);
    const [showOverlay, setShowOverlay] = useState([]);
    const [mapLevel, setMapLevel] = useState([]);

    const [mapObj, setMapObj] = useState(null);
    const mapRadius = useRef(2);

    const [currentGeoLoc, setCurrentGeoLoc] = useState(null);

    const trackingIntervalRef = useRef(null);
    const [isTrackingMode, setIsTrackingMode] = useState(false);

    useEffect(() => {
        void setCurrentMap();
    }, []);

    const trackingMode = () => {
        if(!isTrackingMode){
            onTrackingMode();
        } else {
            offTrackingMode();
        }
    }

    const onTrackingMode = useCallback(() => {
        setIsTrackingMode(true);
        trackingIntervalRef.current = setInterval(() => {
            console.log('traking...');
            void setCurrentMap();
        }, 5000);
    }, []);

    const offTrackingMode = useCallback(() => {
        clearInterval(trackingIntervalRef.current);
        setIsTrackingMode(false);
        trackingIntervalRef.current = null;
    }, []);

    const showBoardDetail = (board) => {
        navigate('/main/boardDetail', {
            state : {
                board : board
            }
        });
    }

    const setCurrentMap = async () => {
        let geoLoc = await comn.getGeoLocation();
        setCurrentGeoLoc(geoLoc);
        void setMap(geoLoc);
    }

    const setMap = async (geoLoc) => {
        let list = await selectNearby(geoLoc, mapRadius.current);
        setMapList(list);
        await showMap(geoLoc.latitude, geoLoc.longitude, list);
    }


    const showMap = async (latitude, longitude, list) => {
        let level = mapLevel[0];
        if(level == null) level = 7;
        let {map, marker} = comn.setMap('mainMap', latitude, longitude, level);
        setMapObj(map);

        kakao.maps.event.removeListener(map, 'click');
        kakao.maps.event.addListener(map, 'click', function(mouseEvent){
            let newMapLevel = mapLevel;
            newMapLevel.splice(0, 1);
            newMapLevel.push(map.getLevel());
            setMapLevel(newMapLevel);

            let latlng = mouseEvent.latLng;

            marker.setPosition(latlng);
            let geoLoc = {
                latitude : latlng.getLat(),
                longitude : latlng.getLng()
            }
            offTrackingMode();
            setCurrentGeoLoc(geoLoc);
            setMap(geoLoc);
        });

        createCircle(map, latitude, longitude);

        list.forEach((board, index) => {
            let imgSize = new kakao.maps.Size(20, 20);
            let imgSrc = comn.imgGend(board.categorySysCd);

            let markerImg = new kakao.maps.MarkerImage(imgSrc, imgSize);

            let mkr = new kakao.maps.Marker({
                map : map,
                position : new kakao.maps.LatLng(board.district.latitude, board.district.longitude),
                title : board.title,
                image : markerImg
            });

            let iwContent = document.createElement('div');
            iwContent.className = 'iwContent';
            let iwSpan = document.createElement('span');
            iwSpan.innerText = `${board.title}`;
            iwContent.appendChild(iwSpan);

            let overlay = new kakao.maps.CustomOverlay({
                position : mkr.getPosition(),
                content : iwContent,
                xAnchor: 0.51,
                yAnchor: 1.7
            });

            iwContent.addEventListener('click', function(){
                showBoardDetail(board);
            });

            kakao.maps.event.addListener(mkr, 'click', function(){
                let existOverlay = false;
                let newOvly = showOverlay;

                if(showOverlay.length !== 0) {
                    newOvly.forEach((item, index, object) => {
                        if(item.cc === overlay.cc){
                            existOverlay = true;
                            object.splice(index, 1);
                        }
                    });
                }
                if(!existOverlay){
                    newOvly.push(overlay);
                    overlay.setMap(map);

                    setTimeout(() => {
                        overlay.setMap(null);
                    }, 3000);
                } else {
                    overlay.setMap(null);
                }
                setShowOverlay(newOvly);
            });
        });
    }

    const selectNearby = async (geoLoc, maxDistance) => {
        geoLoc.maxDistance = maxDistance;
        return await(await axios.get('/board/selectNearby', {
            method : 'GET',
            params : geoLoc
        })).data;
    }

    const createCircle = (map, latitude, longitude) => {
        let circle = new kakao.maps.Circle({
            center : new kakao.maps.LatLng(latitude, longitude),
            radius: mapRadius.current*1000,
            strokeWeight: 3,
            strokeColor: '#292b51',
            strokeOpacity: 1,
            strokeStyle: 'dashed',
            fillColor: '#F6F7F1',
            fillOpacity: 0.3
        });
        circle.setMap(map);
    }

    const chngMapRadius = async () => {
        let newMapLevel = mapLevel;
        newMapLevel.splice(0, 1);
        newMapLevel.push(mapObj.getLevel());
        setMapLevel(newMapLevel);

        void setMap(currentGeoLoc);
    }

    return (
        <div className="mainMapWrapper">
            {/*<div className="mapHeader">*/}
            {/*    <a>필터</a>*/}
            {/*</div>*/}
            <div className="mapBody">
                <div className="mapOpt">
                    <div>
                        <a className="btn"
                           onClick={trackingMode}
                           style={isTrackingMode ?
                                    {borderColor:'green', backgroundColor:'green'} : {borderColor : '#801806', backgroundColor: '#801806'}}
                        >TRACKING : {isTrackingMode ? 'ON' : 'OFF'}</a>
                    </div>
                </div>
                <div id="mainMap" className="map" style={{height:'40vh'}}></div>
                <UpdownNum num={mapRadius} onChange={chngMapRadius}/>
            </div>
            <div className="mapFooter">
                <span>onMyNear : {mapList.length}</span>
            </div>
        </div>
    )
    
}


export default MainMap;