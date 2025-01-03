import {useEffect, useState} from "react";
import * as comn from "../../comn/comnFunction";
import {useInput} from "../../hks/useInput";
import Modal from "./Modal";
import FindLocSearchResultModal from "./findLocSearchResultModal";
const {kakao} = window;

function FindLocModal({callback, showModal}){

    const [selectedGeoLoc, setSelectedGeoLoc] = useState(null);
    const [selectedLocNm, setSelectedLocNm] = useState('');
    const [selectedRegion, setSelectedRegion] = useState('');
    const searchKeyword = useInput('');

    const [showSearchListModal, setShowSearchListModal] = useState(false);
    const [searchResultList, setSearchResultList] = useState([]);

    useEffect(() => {
        if(showModal){
            void createMap();
        }
    }, [showModal]);

    const createMap = async (geoLoc) => {
        if(geoLoc == null){
            geoLoc = await comn.getGeoLocation();
        }
        setSelectedGeoLoc(geoLoc);
        let {map, marker} = await comn.setMap('searchMap', geoLoc.latitude, geoLoc.longitude, true, 8);

        let geocoder = new kakao.maps.services.Geocoder();
        geocoder.coord2RegionCode(map.getCenter().getLng(), map.getCenter().getLat(), coordResult);

        kakao.maps.event.addListener(map, 'click', function(mouseEvent){
            let latlng = mouseEvent.latLng;
            marker.setPosition(latlng);
            let newGeoLoc = {
                latitude : latlng.getLat(),
                longitude : latlng.getLng()
            }
            setSelectedGeoLoc(newGeoLoc);
            geocoder.coord2RegionCode(latlng.getLng(), latlng.getLat(), coordResult);
        });
    }

    const coordResult = (result, status) => {
        if(result[1] != null){
            setSelectedRegion(result[1].region_1depth_name);
            setSelectedLocNm(result[1].address_name);
        } else {
            setSelectedRegion(result[0].region_1depth_name);
            setSelectedLocNm(result[0].address_name);
        }
    }

    const searchByKeyword = async() => {
        let geocoder = new kakao.maps.services.Geocoder();
        geocoder.addressSearch(searchKeyword.val, function(result, status){
            if(result.length > 1){
                setSearchResultList(result);
                setShowSearchListModal(true);
            } else if(result.length === 1){
                setMapBySearch(result[0]);
            } else {
                /// 주소검색 결과 없는 경우 장소검색으로 전환
                let ps = new kakao.maps.services.Places();
                ps.keywordSearch(searchKeyword.val, placeSearch);
                return false;
            }
        });
    }

    const placeSearch = async(data, status, pagination) => {
        setSearchResultList(data);
        setShowSearchListModal(true);
    }

    const onSearchKeywordKeyup = (event) => {
        const keycode = event.keyCode;
        if(keycode === 13){
            void searchByKeyword();
        }
    }

    const setMapBySearch = (result) => {
        let geoLoc = {
            latitude : result.y,
            longitude : result.x
        }
        void createMap(geoLoc);
    }

    const selectSearchResult = (result) => {
        setMapBySearch(result);
        setShowSearchListModal(false);
    }

    const sendReponse = () => {
        const param = {
            locNm : selectedLocNm,
            geoLoc : selectedGeoLoc,
            region : selectedRegion
        }
        callback(param);
    }

    return (
        <div className="searchMapWrapper">
            <Modal title={'장소 선택'}
                   content={<FindLocSearchResultModal resultList={searchResultList}
                                                      callback={selectSearchResult}
                            />}
                   isOpen={showSearchListModal}
                   setIsOpen={setShowSearchListModal}
            />
            <div className="flex mb_1">
                <input type="text"
                       className="input wd_90"
                       value={searchKeyword.val}
                       onChange={searchKeyword.onChange}
                       onKeyUp={onSearchKeywordKeyup}
                />
                <a className="btn bd_orange orange ml_1"
                   onClick={searchByKeyword}
                >검색</a>
            </div>
            <div id="searchMap" className="map"></div>
            <div className="titWrapper mt_1 orange">
                <div>선택주소</div>
                <div>
                    <input type="text"
                           className="input wd_100"
                           value={selectedLocNm}
                           disabled={true}
                    />
                </div>
            </div>

            <a className="btn bd_orange bg_orange mt_1"
               onClick={sendReponse}
            >선택</a>
        </div>
    )
}

export default FindLocModal;