import '../../css/main.css';
import {useCallback, useEffect, useLayoutEffect, useRef, useState} from "react";
import {useNavigate} from "react-router-dom";
import BoardList from "../board/boardList";
import * as comn from "../../comn/comnFunction";
import UpdownNum from "../comn/updownNum";
import axios from "axios";
import RoundImgIco from "../comn/roundImgIco";
import SearchFilter from "./searchFilter";
const {kakao} = window;



function Main(){

    const navigate = useNavigate();
    const [boardList, setBoardList] = useState([]);

    const [mapObj, setMapObj] = useState(null);
    const [showOverlay, setShowOverlay] = useState([]);
    const [mapLevel, setMapLevel] = useState([]);
    const mapRadius = useRef(2);

    const [currentGeoLoc, setCurrentGeoLoc] = useState(null);
    const trackingIntervalRef = useRef(null);
    const [isTrackingMode, setIsTrackingMode] = useState(false);

    const [onFilter, setOnFilter] = useState(false);

    useEffect(() => {
        if(window.localStorage.getItem('yOffset') == null){
            comn.scrollToTop();
        }
        void setCurrentMap();

        return () => {
            clearInterval(trackingIntervalRef.current);
        }

    }, [navigate]);

    useLayoutEffect(() => {
            const savedOffset = window.localStorage.getItem('yOffset');
            if(savedOffset != null){
                window.scroll(0, Number(savedOffset))
            }
    });

    const saveScrollY = () => {
        const yOffset = window.pageYOffset;
        window.localStorage.setItem('yOffset', yOffset);
    }

    const trackingMode = () => {
        if(!isTrackingMode){
            onTrackingMode();
        } else {
            offTrackingMode();
        }
    }

    const onTrackingMode = useCallback(() => {
        setIsTrackingMode(true);
        mapRadius.current = 2;
        trackingIntervalRef.current = setInterval(() => {
            deleteLocalLocInfo();
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

    const selectNearby = async (geoLoc, maxDistance) => {
        geoLoc.maxDistance = maxDistance;

        let param = geoLoc;
        let categoryStr = window.localStorage.getItem('filterCtgr');
        if(categoryStr != null){
            let category = JSON.parse(categoryStr);
            param.category = category.ctgr2 !== '' ? category.ctgr2 : category.ctgr1
        }

        return await(await axios.get('/board/selectNearby', {
            method : 'GET',
            params : param
        })).data;
    }

    const setCurrentMap = async () => {
        let geoLoc = null;

        // 필터 검색 > 상세페이지 또는 기타 navigate 이후 반영
        const fGeoLoc = JSON.parse(window.localStorage.getItem('filterGeoLoc'));
        if(fGeoLoc != null){
            geoLoc = fGeoLoc;
            if(fGeoLoc.radius != null && fGeoLoc.radius !== 0){
                mapRadius.current = fGeoLoc.radius;
            }
            mapLevel[0] = fGeoLoc.mapLevel;
            setMapLevel(mapLevel);
        } else {
            geoLoc = await comn.getGeoLocation();
        }

        setCurrentGeoLoc(geoLoc);
        void setMap(geoLoc);
    }

    const setMap = async (geoLoc) => {
        let list = await selectNearby(geoLoc, mapRadius.current);
        setBoardList(list);
        await showMap(geoLoc.latitude, geoLoc.longitude, list);
    }

    const showMap = async (latitude, longitude, list) => {
        let level = mapLevel[0];
        if(level == null) level = 7;
        let {map, marker} = comn.setMap('mainMap', latitude, longitude, level);
        setMapObj(map);

        kakao.maps.event.removeListener(map, 'click');
        kakao.maps.event.addListener(map, 'click', function(mouseEvent){
            deleteLocalLocInfo();

            mapLevel[0] = map.getLevel();
            setMapLevel(mapLevel);

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

        kakao.maps.event.addListener(map, 'zoom_changed', function(){
            let newMapLevel = mapLevel;
            newMapLevel.splice(0, 1);
            newMapLevel.push(map.getLevel());
            setMapLevel(newMapLevel);
        });

        createCircle(map, latitude, longitude);

        list.forEach((board, index) => {
            let imgSize = new kakao.maps.Size(20, 20);
            let imgSrc = comn.imgGend(board.categoryVo);

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
        mapLevelRadiusMatcher();
        void setMap(currentGeoLoc);
    }

    const mapLevelRadiusMatcher = () => {
        let newMapLevel = mapLevel;
        newMapLevel.splice(0, 1);

        let level = mapObj.getLevel();
        let radius = mapRadius.current;
        if(radius < 4){
            level = 7;
        } else if(radius < 6){
            level = 8;
        } else if(radius < 11){
            level = 9;
        } else if(radius < 23){
            level = 10;
        } else if(radius < 46){
            level = 11;
        } else if(radius < 200){
            level = 13;
        } else {
            level = 14;
        }

        newMapLevel.push(level);
        setMapLevel(newMapLevel);
    }

    const filterOnchange = () => {
        setOnFilter((current) => !current);
    }

    const applyFilter = async (region, category) => {
        // 필터에 적용된 category set  >> 순서 반드시 우선시
        // setFilterCtgr(category);
        window.localStorage.setItem('filterCtgr', JSON.stringify(category));

        const result = await (await (axios.get('/district/selectRegionGeoLoc', {
            method: 'GET',
            params : region
        }))).data;

        mapRadius.current = result.radius === 0 ? 2 : result.radius;
        mapLevelRadiusMatcher();
        setCurrentGeoLoc(result.geoLoc);
        void setMap(result.geoLoc);

        // 초기화면에서 저장된 filter값을 유지하기 위해 저장
        let fGeoLoc = result.geoLoc;
        fGeoLoc.radius = result.radius;
        fGeoLoc.mapLevel = mapLevel[0];
        window.localStorage.setItem('filterGeoLoc', JSON.stringify(fGeoLoc));
        window.localStorage.setItem('filterRegion', JSON.stringify(region));
    }

    const resetFilter = async () => {
        deleteLocalLocInfo();
        mapRadius.current = 2;
        mapLevel.splice(0, 1);
        setMapLevel(mapLevel);
        void setCurrentMap();
    }

    const deleteLocalLocInfo = () => {
        window.localStorage.removeItem('filterGeoLoc');
        window.localStorage.removeItem('filterRegion');
        window.localStorage.removeItem('filterCtgr');
        mapLevel[0] = 7;
        setMapLevel(mapLevel);
        setOnFilter(false);
    }

    return (
        <div className="mainWrapper" onClick={saveScrollY}>
            <div className="mainIco">
                <div className="left">
                    <RoundImgIco img={onFilter ? 'filter_off.png' : 'filter_on.png'}
                                 onClick={filterOnchange}
                    />
                </div>
                <div className="right">
                    <RoundImgIco img={isTrackingMode ? 'location-on.png' : 'location-off.png'}
                                 onClick={trackingMode}
                    />
                    <UpdownNum num={mapRadius} onChange={chngMapRadius}/>
                </div>
            </div>
            {onFilter ? <SearchFilter submit={applyFilter} reset={resetFilter}/> : ''}
            <div id="mainMap" className="map"></div>
            <BoardList boardList={boardList} isTracking={isTrackingMode}/>
        </div>
    )
    
}


export default Main;