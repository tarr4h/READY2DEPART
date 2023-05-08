import '../../css/mainMap.css';
import {useEffect, useRef, useState} from "react";
import * as comn from "../../comn/comnFunction";
import axios from "axios";
import {useNavigate} from "react-router-dom";
const {kakao} = window;


function MainMap(){

    const navigate = useNavigate();
    const [mapList, setMapList] = useState([]);
    const [showOverlay, setShowOverlay] = useState([]);
    const [mapLevel, setMapLevel] = useState(7);

    useEffect(() => {
        void setCurrentMap();
    }, []);

    const showBoardDetail = (board) => {
        navigate('/main/boardDetail', {
            state : {
                board : board
            }
        });
    }

    const setMap = async (geoLoc) => {
        let list = await selectNearby(geoLoc, 2);
        setMapList(list);
        await showMap(geoLoc.latitude, geoLoc.longitude, list);
    }

    const setCurrentMap = async () => {
        let geoLoc = await comn.getGeoLocation();
        void setMap(geoLoc);
    }

    const test = () => {
        console.log('mapLevel : ', mapLevel);
        setMapLevel(19);
    }

    const showMap = async (latitude, longitude, list) => {
        console.log('mapLevel showMap : ', mapLevel);
        let {map, marker} = comn.setMap(latitude, longitude, 7);

        // zoom event
        kakao.maps.event.addListener(map, 'zoom_changed', function(){
            // let level = map.getLevel();
            // test(level);
        });

        createCircle(map, latitude, longitude, 2*1000);

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

            kakao.maps.event.addListener(map, 'click', function(mouseEvent){
                let latlng = mouseEvent.latLng;

                marker.setPosition(latlng);
                let geoLoc = {
                    latitude : latlng.getLat(),
                    longitude : latlng.getLng()
                }
                setMap(geoLoc);
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

    const createCircle = (map, latitude, longitude, radiusValue) => {
        var circle = new kakao.maps.Circle({
            center : new kakao.maps.LatLng(latitude, longitude),
            radius: radiusValue,
            strokeWeight: 3,
            strokeColor: '#292b51',
            strokeOpacity: 1,
            strokeStyle: 'dashed',
            fillColor: '#F6F7F1',
            fillOpacity: 0.3
        });

        circle.setMap(map);
    }

    return (
        <div className="mainMapWrapper">
            <button onClick={test}
            >test</button>
            <div className="mapHeader">
                <a>필터</a>
                <br/>
                <span>onMyNear : {mapList.length}</span>
            </div>
            <div className="mapBody">
                <div id="map" style={{height:'40vh'}}></div>
            </div>
        </div>
    )
    
}


export default MainMap;