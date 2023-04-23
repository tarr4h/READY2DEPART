import '../../css/register.css';
import '../../css/Comn.css';
import {useEffect, useState} from "react";
import {useForm} from "react-hook-form";
import AddInfo from "./addInfo";
const {kakao} = window;
const {daum} = window;

function Register(){

    const [searchLoc, setSearchLoc] = useState(false);
    const [additionalInfoView, setAdditionalInfoView] = useState(false);
    const [additionalInfo, setAdditionalInfo] = useState([]);
    const [addr, setAddr] = useState('');
    const [fileList, setFileList] = useState([]);
    const [previewList, setPreviewList] = useState([]);

    const {register, handleSubmit} = useForm();

    useEffect(() => {
        void findLocByGeoLoc();
    }, []);

    function showAdditionalInfo(){
        setAdditionalInfoView((current) => !current);
    }

    function showSearchLoc(){
        void findLocByGeoLoc();
        setSearchLoc(true);
    }

    ///// geoLocation
    function getGeoLocation() {
        return new Promise(function (resolve) {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(function (position) {
                    let latitude = position.coords.latitude;
                    let longitude = position.coords.longitude;

                    let loc = {
                        latitude,
                        longitude
                    };

                    resolve(loc);
                });
            } else {
                alert('geolocation 사용불가');
            }
        })
    }

    function getLocationByPostCode(){
        new daum.Postcode({
            oncomplete: function(data) {
                findLocByAddr(data.address);
            }
        }).open();
    }

    function findLocByAddr(addr){
        let geocoder = new kakao.maps.services.Geocoder();

        geocoder.addressSearch(addr, function(result, status){
            let geoLoc = {
                latitude : result[0].road_address.y,
                longitude : result[0].road_address.x
            }

            setAddress(geoLoc);
            setSearchLoc(true);
        });
    }

    async function findLocByGeoLoc() {
        let geoLoc = await getGeoLocation();
        setAddress(geoLoc);
    }

    function setAddress(geoLoc){
        let geocoder = new kakao.maps.services.Geocoder();
        let coord = new kakao.maps.LatLng(geoLoc.latitude, geoLoc.longitude);
        let callback = function (res, status, jqXHR) {
            if(res[0].road_address != null){
                setAddr(res[0].road_address.address_name);
            } else {
                setAddr(res[0].address.address_name);
            }
        };

        geocoder.coord2Address(coord.getLng(), coord.getLat(), callback);

        setMap(geoLoc);
    }

    function setMap(geoLoc){
        let mapContainer = document.getElementById('map'),
            mapOption = {
                center: new kakao.maps.LatLng(geoLoc.latitude, geoLoc.longitude),
                level: 3
            };

        let map = new kakao.maps.Map(mapContainer, mapOption);

        let markerPosition = new kakao.maps.LatLng(geoLoc.latitude, geoLoc.longitude);
        let marker = new kakao.maps.Marker({
            position: markerPosition
        });

        marker.setMap(map);

        // 지도 클릭하여 주소, 마커 재지정
        kakao.maps.event.addListener(map, 'click', function(mouseEvent){
            let latlng = mouseEvent.latLng;

            marker.setPosition(latlng);

            let param = {
                latitude : latlng.getLat(),
                longitude : latlng.getLng()
            }

            setAddress(param);
        })
    }

    function uploadFile(e){
        let newFileList = fileList;
        let appendFiles = e.target.files;
        Array.from(appendFiles).forEach(item => {
            newFileList.push(item);
        });
        setFileList([...newFileList]);
        appendPreview();
    }

    function appendPreview(appendFileList){
        let appendPreviewList = [];
        fileList.forEach(file => {
            const reader = new FileReader();
            reader.readAsDataURL(file);

            return new Promise((resolve) => {
                reader.onload = () => {
                    appendPreviewList.push(reader.result);
                    setPreviewList([...appendPreviewList]);
                    resolve();
                }
            })
        })
    }

    const onSubmit = async (data) => {
        data.fileList = fileList;
        data.addInfoList = additionalInfo;
        console.log(data);

        let result = await(await insertContent(data)).json();
        console.log(result);
        let fileResult = await(await insertFile(fileList)).json();
        console.log(fileResult);
    }

    function insertContent(param){
        return new Promise((resolve, reject) => {
            let res = fetch('/register/insertContent', {
                method : 'POST',
                headers : {
                    'Content-Type' : 'application/json',
                },
                body: JSON.stringify(param)
            });
            resolve(res);
        })
    }

    function insertFile(files){
        return new Promise((resolve, reject) => {
            let formData = new FormData();
            files.forEach(file => {
                formData.append('file', file);
            });

            let res = fetch('/register/insertFile', {
                method : 'POST',
                headers : {
                    enctype : 'multipart/form-data'
                },
                body : formData
            });
            resolve(res);
        })


    }

    return (
        <div>
            <form id="regFrm" onSubmit={handleSubmit(onSubmit)} encType="multipart/form-data">
                <div className="register_wrapper">
                    <div className="line_case">
                        <div className="line_tit">
                            <span>제목</span>
                        </div>
                        <div className="line_body">
                            <input type="text" name="title" {...register("title")}/>
                        </div>
                    </div>
                    <div className="line_case">
                        <div className="line_tit">
                            <span>장소</span>
                            <div className="tit_btn">
                                <a onClick={showSearchLoc}>현재위치</a>
                                <a onClick={getLocationByPostCode}>위치검색</a>
                            </div>
                        </div>
                        <div className="line_body">
                            <input
                                type="text"
                                name="location"
                                value={addr}
                                {...register("location")}
                                readOnly={true}
                            />
                        </div>
                        <div className="line_foot">
                            <div className="search_loc"
                                 style={
                                    searchLoc ? {visibility:'visible', height:'inherit'} : {visibility:'hidden', height: 0}
                                 }
                            >
                                <div id="map"
                                     style={{
                                         width: '100%',
                                         height: '30vh'
                                     }}
                                ></div>
                            </div>
                        </div>
                    </div>
                    <div className="line_case">
                        <div className="line_tit">
                            <span>장소명</span>
                        </div>
                        <div className="line_body">
                            <input type="text" name="locNm" {...register("locNm")}/>
                        </div>
                    </div>
                    <div className="line_case">
                        <div className="line_tit">
                            <span>한줄요약</span>
                        </div>
                        <div className="line_body">
                            <input type="text" name="summary" {...register("summary")}/>
                        </div>
                    </div>
                    <div className="line_case">
                        <div className="line_tit">
                            <span>내용</span>
                        </div>
                        <div className="line_body">
                            <textarea name="content" cols="30" rows="10" {...register("content")}></textarea>
                        </div>
                    </div>
                    <div className="line_case">
                        <div className="line_tit">
                            <span>사진</span>
                            <div className="tit_btn">
                                <label
                                    htmlFor="fileInput"
                                >파일 등록</label>
                                <input
                                    id="fileInput"
                                    type="file"
                                    name="file"
                                    onChange={uploadFile}
                                    multiple={true}
                                    hidden={true}
                                />
                            </div>
                        </div>
                        <div className="line_body">
                            <div className="previewWrapper">
                                {previewList.map((preview, index) => (
                                    <img className="previewImg" key={index} src={preview} alt=""/>
                                ))}
                            </div>
                        </div>
                    </div>
                    <div className="line_case">
                        <div className="line_tit">
                            <span>추가정보</span>
                            <div className="tit_btn">
                                <a onClick={showAdditionalInfo}
                                   style={
                                       additionalInfoView ? {backgroundColor: '#FFF', color:'#485373'} : {}
                                   }
                                >
                                    {additionalInfoView ? '닫기' : '입력하기'}
                                </a>
                            </div>
                        </div>
                        <div className="line_body">
                            <div className="addInfoWrapper">
                                {additionalInfoView ? <AddInfo additionalInfo={additionalInfo} setAdditionalInfo={setAdditionalInfo}/> : null}
                            </div>
                        </div>
                    </div>
                    <a className="registerBtn" onClick={handleSubmit(onSubmit)}>등록하기</a>
                </div>
            </form>
        </div>
    )
}

export default Register;