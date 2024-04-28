import '../../css/main.css';
import {useCallback, useEffect, useLayoutEffect, useRef, useState} from "react";
import {useNavigate} from "react-router-dom";
import BoardList from "../board/boardList";
import * as comn from "../../comn/comnFunction";
import UpdownNum from "../comn/updownNum";
import axios from "axios";
import RoundImgIco from "../comn/roundImgIco";
import SearchFilter from "./searchFilter";
import qs from "qs";
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
        const currGeoLoc = window.localStorage.getItem('currGeoLoc');
        if(currGeoLoc == null){
            void setCurrentMap();
        } else {
            setCurrentGeoLoc(JSON.parse(currGeoLoc));
            mapLevel[0] = JSON.parse(window.localStorage.getItem('currMapLvl'));
            setMapLevel(mapLevel);
            mapRadius.current = JSON.parse(window.localStorage.getItem('currMapRad'));
            void setMap(JSON.parse(currGeoLoc));
        }

    }, []);

    useEffect(() => {
        if(window.localStorage.getItem('yOffset') == null){
            comn.scrollToTop();
        }

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
        window.localStorage.setItem('yOffset', yOffset.toString());
    }

    const trackingMode = async () => {
        if(!isTrackingMode){
            comn.blockUI();
            deleteLocalLocInfo();
            await setCurrentMap();
            comn.unBlockUI();
            onTrackingMode();
        } else {
            offTrackingMode();
        }
    }

    const onTrackingMode = useCallback(() => {
        setIsTrackingMode(true);
        mapRadius.current = 2;
        trackingIntervalRef.current = setInterval(() => {
            // deleteLocalLocInfo();
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

        let addInfoStr = window.localStorage.getItem('filterAddInfo');
        if(addInfoStr != null){
            param.addInfoList = JSON.parse(addInfoStr);
        }

        return await(await axios.post('/board/selectNearby', param)).data;
    }

    const setCurrentMap = async () => {
        comn.blockUI();
        let geoLoc;

        // 필터 검색 > 상세페이지 또는 기타 navigate 이후 반영
        const fGeoLoc = window.localStorage.getItem('filterGeoLoc');
        if(fGeoLoc != null){
            geoLoc = JSON.parse(fGeoLoc);
            if(geoLoc.radius != null && geoLoc.radius !== 0){
                mapRadius.current = geoLoc.radius;
            }
            mapLevel[0] = geoLoc.mapLevel;
            setMapLevel(mapLevel);
        } else {
            geoLoc = await comn.getGeoLocation();
        }

        setCurrentGeoLoc(geoLoc);
        comn.unBlockUI();
        void setMap(geoLoc);
    }

    const setMap = async (geoLoc) => {
        comn.blockUI();
        let list = await selectNearby(geoLoc, mapRadius.current);
        setBoardList(list);
        await showMap(geoLoc.latitude, geoLoc.longitude, list);
        comn.unBlockUI();
    }

    const showMap = async (latitude, longitude, list) => {
        let level = mapLevel[0];
        if(level == null) level = 7;
        let {map, marker} = await comn.setMap('mainMap', latitude, longitude, true, level);

        if(!map){
            return false;
        }

        setMapObj(map);

        kakao.maps.event.removeListener(map, 'click');
        kakao.maps.event.addListener(map, 'click', function(mouseEvent){
            deleteLocalLocInfo();
            saveScrollY();

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
            window.localStorage.setItem('currGeoLoc', JSON.stringify(geoLoc));
            window.localStorage.setItem('currMapLvl', JSON.stringify(map.getLevel()));
            window.localStorage.setItem('currMapRad', JSON.stringify(mapRadius.current));
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

            let imgSrc;
            try{
                imgSrc = comn.imgGend(board.categoryVo);

            } catch (error) {
                console.error('error : ', error);
            }

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

        let radius = mapRadius.current;
        let level = comn.mapLevelRadiusMatcher(radius);

        newMapLevel.push(level);
        setMapLevel(newMapLevel);
    }

    const filterOnchange = () => {
        setOnFilter((current) => !current);
    }

    const applyFilter = async (region, category, addInfo) => {
        comn.blockUI();
        // 필터에 적용된 category set  >> 순서 반드시 우선시
        // setFilterCtgr(category);
        window.localStorage.setItem('filterCtgr', JSON.stringify(category));
        window.localStorage.setItem('filterAddInfo', JSON.stringify(addInfo));

        const result = await (await (axios.get('/district/selectRegionGeoLoc', {
            method: 'GET',
            params : region
        }))).data;

        mapRadius.current = result.radius === 0 ? 2 : result.radius;
        mapLevelRadiusMatcher();
        window.localStorage.setItem('currGeoLoc', JSON.stringify(result.geoLoc));
        window.localStorage.setItem('currMapRad', JSON.stringify(mapRadius.current));
        window.localStorage.setItem('currMapLvl', JSON.stringify(mapLevel[0]));
        setCurrentGeoLoc(result.geoLoc);
        await setMap(result.geoLoc);

        // 초기화면에서 저장된 filter값을 유지하기 위해 저장
        let fGeoLoc = result.geoLoc;
        fGeoLoc.radius = result.radius;
        fGeoLoc.mapLevel = mapLevel[0];
        window.localStorage.setItem('filterGeoLoc', JSON.stringify(fGeoLoc));
        window.localStorage.setItem('filterRegion', JSON.stringify(region));
        comn.unBlockUI();
    }

    const resetFilter = async () => {
        comn.blockUI();
        deleteLocalLocInfo();
        mapRadius.current = 2;
        mapLevel.splice(0, 1);
        setMapLevel(mapLevel);
        await setCurrentMap();
        comn.unBlockUI();
    }

    const deleteLocalLocInfo = () => {
        window.localStorage.removeItem('filterGeoLoc');
        window.localStorage.removeItem('filterRegion');
        window.localStorage.removeItem('filterCtgr');
        window.localStorage.removeItem('filterAddInfo');
        window.localStorage.removeItem('currGeoLoc');
        window.localStorage.removeItem('currMapLvl');
        window.localStorage.removeItem('currMapRad');

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