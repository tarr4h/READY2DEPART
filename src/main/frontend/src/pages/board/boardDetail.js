import {Link, useLocation} from "react-router-dom";
import '../../css/BoardDetail.css';
import {useEffect, useState} from "react";
const {kakao} = window;
const {daum} = window;

function BoardDetail(){

    const location = useLocation();
    const board = location.state.board;
    console.log(board);

    const [extraInfo, setExtraInfo] = useState(false);

    useEffect(() => {
        showMap();
    })

    const appendAll = () => {
        setExtraInfo(true);
    }

    function showMap(){
        let mapContainer = document.getElementById('map'),
            mapOption = {
                center: new kakao.maps.LatLng(board.district.latitude, board.district.longitude), // 지도의 중심좌표
                level: 3 // 지도의 확대 레벨
            };

        let map = new kakao.maps.Map(mapContainer, mapOption);

        let markerPosition = new kakao.maps.LatLng(board.district.latitude, board.district.longitude);
        let marker = new kakao.maps.Marker({
            position: markerPosition
        })

        marker.setMap(map);

        let addr = board.title;

        let iwContent = `<div class="iwContent"><span>${addr}</span></div>`;
        let iwPosition = new kakao.maps.LatLng(board.district.latitude, board.district.longitude);

        let customOverlay = new kakao.maps.CustomOverlay({
            position: iwPosition,
            content: iwContent,
            xAnchor: 0.51,
            yAnchor: 2.4
        });

        customOverlay.setMap(map);
    }

    return (
        <div className="boardDetailWrapper">
            <div className="boardDetail">
                <div>
                    <h1 className="detailTit">{board.title}</h1>
                </div>
                <div>
                    <span>{board.modDt}</span>
                </div>
                <div>
                    <div id="map"></div>
                </div>
                <div>
                    <span>{board.district.addr}</span>
                </div>
                <div>
                    <div>{board.categorySysCd.nm}</div>
                </div>
                <div>
                    <span>{board.summary}</span>
                </div>
                <div>
                    <div className="rating">
                        <input type="radio" name="rating" value="5" id="rating-5" defaultChecked={board.rating === 5}/>
                        <label htmlFor="rating-5"></label>
                        <input type="radio" name="rating" value="4" id="rating-4" defaultChecked={board.rating === 4}/>
                        <label htmlFor="rating-4"></label>
                        <input type="radio" name="rating" value="3" id="rating-3" defaultChecked={board.rating === 3}/>
                        <label htmlFor="rating-3"></label>
                        <input type="radio" name="rating" value="2" id="rating-2" defaultChecked={board.rating === 2}/>
                        <label htmlFor="rating-2"></label>
                        <input type="radio" name="rating" value="1" id="rating-1" defaultChecked={board.rating === 1}/>
                        <label htmlFor="rating-1"></label>
                    </div>
                </div>
                <div className="bdAddInfoWrapper">
                    {board.addInfoList.map((addInfo, index) => (
                        (index <  3 ? <div key={index}>{addInfo.sysCdNm}</div>
                            : (index === 3 ?
                                <div key={index}>
                                    <div
                                        onClick={appendAll}
                                        style={extraInfo ? {display : 'none'} : {display:'inherit'}}
                                    >
                                        + {board.addInfoList.length - 3}
                                    </div>
                                    <div
                                        style={extraInfo ? {display:'inherit'} : {display:'none'}}
                                    >
                                        {addInfo.sysCdNm}
                                    </div>
                                </div>
                                : <div key={index}
                                       style={extraInfo ? {display:'inherit'} : {display:'none'}}
                                >
                                    {addInfo.sysCdNm}
                                </div>))
                    ))}
                </div>
                <div>
                    <textarea
                        defaultValue={board.content}
                        disabled={true}
                    ></textarea>
                </div>
                <div className="imgWrapper">
                    {board.fileList.map((item, index) => (
                        <div key={index}>
                            <a href={`/board/imgView/${item.refId}/${item.id}`}>
                                <img src={`/board/imgView/${item.refId}/${item.id}`} alt="img"/>
                            </a>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default BoardDetail;