import '../../css/register.css';
import '../../css/Comn.css';
import {useEffect, useLayoutEffect, useRef, useState} from "react";
import {useForm} from "react-hook-form";
import AddInfo from "./addInfo";
import {useNavigate} from "react-router-dom";
import axios from "axios";
import BoardCategory from "../board/boardCategory";
import * as comn from "../../comn/comnFunction";
import BoardCategoryDetail from "../board/boardCategoryDetail";
const {kakao} = window;
const {daum} = window;

function Register(){

    const navigate = useNavigate();

    const [httpPlaceholder, setHttpPlaceholder] = useState(false);
    const [searchLoc, setSearchLoc] = useState(false);
    const [additionalInfoView, setAdditionalInfoView] = useState(false);
    const [additionalInfo, setAdditionalInfo] = useState([]);
    const [category, setCategory] = useState([]);
    const [fileList, setFileList] = useState([]);
    const [previewList, setPreviewList] = useState([]);

    const [isRating, setIsRating] = useState(false);
    const [selectedCtgr, setSelectedCtgr] = useState('');

    const [districtInfo, setDistrictInfo] = useState({});
    const [validateLocNm, setValidateLocNm] = useState(true);

    const {register, setValue, handleSubmit} = useForm();

    useEffect(() => {
        void findLocByGeoLoc();
        void selectBoardCategory();
        comn.scrollToTop();
    }, []);

    async function selectBoardCategory(){
        const param = {
            sysCd : 'SYS0000004'
        }
        try{
            const result = await axios.get('/register/selectBoardCategory', {
                method : 'GET',
                params : param
            });
            setCategory(result.data);
        } catch (err){

        }
    }

    function showAdditionalInfo(){
        setAdditionalInfoView((current) => !current);
    }

    function showSearchLoc(){
        void findLocByGeoLoc();
        setSearchLoc(true);
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
            if(result.length === 0) {
                alert('유효하지 않은 주소입니다.');
                return false;
            }
            let geoLoc = {
                latitude : result[0].road_address.y,
                longitude : result[0].road_address.x
            }

            setAddress(geoLoc);
            setSearchLoc(true);
        });
    }

    async function findLocByGeoLoc() {
        let geoLoc = await comn.getGeoLocation();
        if(geoLoc !== {}){
            setHttpPlaceholder(true);
        }
        if(geoLoc != null) setSearchLoc(true);
        setAddress(geoLoc);
    }

    function setAddress(geoLoc){
        let geocoder = new kakao.maps.services.Geocoder();
        let coord = new kakao.maps.LatLng(geoLoc.latitude, geoLoc.longitude);
        let callback = function (res, status, jqXHR) {
            if(res[0].road_address != null){
                setDistrictInfo((current) => (
                    {...current,
                        addr : res[0].road_address.address_name,
                        region1 : res[0].road_address.region_1depth_name,
                        region2 : res[0].road_address.region_2depth_name,
                    }
                ));
                setValue('location', res[0].road_address.address_name);
            } else {
                setDistrictInfo((current) => (
                    {...current,
                        addr : res[0].address.address_name,
                        region1 : res[0].address.region_1depth_name,
                        region2 : res[0].address.region_2depth_name,
                    }
                ));
                setValue('location', res[0].address.address_name);
            }
        };


        geocoder.coord2Address(coord.getLng(), coord.getLat(), callback);
        setDistrictInfo((current) => (
            {...current, latitude : geoLoc.latitude, longitude : geoLoc.longitude}
        ));

        showMap(geoLoc.latitude, geoLoc.longitude);
    }

    function showMap(latitude, longitude){
        let {map, marker} = comn.setMap('registerMap', latitude, longitude);

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

    function uploadFileOnClick(event){
        event.target.value = null;
    }

    function uploadFile(e){
        let newFileList = fileList;
        let appendFiles = e.target.files;
        Array.from(appendFiles).forEach(item => {
            if(item.type.includes('image')){
                newFileList.push(item);
            }
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
        data.district = districtInfo;

        let boardId = await(await insertBoard(data)).text();
        if(fileList.length > 0){
            let fileResult = await(await insertFile(fileList, boardId)).json();
        }
        alert('등록되었습니다.');
        navigate('/home', {replace : true});
    }

    function insertBoard(param){
        return new Promise((resolve, reject) => {
            let res = fetch('/register/insertBoard', {
                method : 'POST',
                headers : {
                    'Content-Type' : 'application/json',
                },
                body: JSON.stringify(param)
            });
            resolve(res);
        })
    }

    function insertFile(files, boardId){
        return new Promise((resolve, reject) => {
            let formData = new FormData();
            formData.append('boardId', boardId);
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
        });
    }

    const removeImg = (evt) => {
        let index = Number(evt.target.dataset.index);
        setPreviewList(current => current.filter((val, ind) => {
            return ind !== index;
        }));
        setFileList(current => current.filter((val, ind) => {
            return ind !== index;
        }));
    }

    const selectRating = () => {
        setIsRating((current) => !current);
    }

    const selectCtgr = (event) => {
        setSelectedCtgr(event.target.value);
    }

    return (
        <div>
            <form id="regFrm" onSubmit={handleSubmit(onSubmit)} encType="multipart/form-data">
                <div className="register_wrapper">
                    <div className="line_case">
                        <div className="line_tit">
                            <span>장소</span>
                            <div className="tit_btn">
                                {httpPlaceholder ? <a onClick={showSearchLoc}>현재위치</a> : ''}
                                <a onClick={getLocationByPostCode}>위치검색</a>
                            </div>
                        </div>
                        <div className="line_body">
                            <input
                                type="text"
                                name="location"
                                {...register("location")}
                                placeholder={httpPlaceholder ? '' : '위치검색을 통해 입력해주세요.'}
                                readOnly={true}
                            />
                        </div>
                        <div className="line_foot">
                            <div className="search_loc"
                                 style={
                                    searchLoc ? {visibility:'visible', height:'inherit'} : {visibility:'hidden', height: 0}
                                 }
                            >
                                <div id="registerMap" className="map"></div>
                            </div>
                        </div>
                    </div>
                    <div className="line_case">
                        <div className="line_tit">
                            <span>장소명</span>
                        </div>
                        <div className="line_body">
                            <input type="text" name="title" {...register("title")}/>
                            {validateLocNm ? '' : <span>장소명을 입력해주세요!</span>}
                        </div>
                    </div>
                    <div className="line_case">
                        <div className="line_tit">
                            <span>유형</span>
                        </div>
                        <div className="line_body">
                            <div className="categoryWrapper">
                                {category.map((ctgr, index) => (
                                    <BoardCategory
                                        key={index}
                                        category={ctgr}
                                        register={register}
                                        onClick={selectCtgr}
                                    />
                                ))}
                            </div>
                            {selectedCtgr !== '' ?
                                <BoardCategoryDetail sysCd={selectedCtgr}
                                                     setSysCd={setSelectedCtgr}
                                                     register={register}
                                                     setRegisterVal={setValue}
                                /> : ''}
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
                            <div className="tit_btn fileUpd">
                                <label
                                    htmlFor="fileInput"
                                >파일 등록</label>
                                <input
                                    id="fileInput"
                                    type="file"
                                    name="file"
                                    onChange={uploadFile}
                                    onClick={uploadFileOnClick}
                                    multiple={true}
                                    hidden={true}
                                />
                            </div>
                        </div>
                        <div className="line_body">
                            <div className="previewWrapper">
                                {previewList.map((preview, index) => (
                                    <div key={index}>
                                        <img className="previewImg" src={preview} alt=""/>
                                        <div className="previewImgClose" data-index={index} onClick={removeImg}>X</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                    <div className="line_case">
                        <div className="line_tit">
                            <span>어땠나요?</span>
                            <div className="tit_btn">
                                {isRating ? (
                                    <div className="rating">
                                        <input type="radio" name="rating" value="5" {...register("rating")} id="rating-5"/>
                                        <label htmlFor="rating-5"></label>
                                        <input type="radio" name="rating" value="4" {...register("rating")} id="rating-4"/>
                                        <label htmlFor="rating-4"></label>
                                        <input type="radio" name="rating" value="3" {...register("rating")} id="rating-3" defaultChecked={true}/>
                                        <label htmlFor="rating-3"></label>
                                        <input type="radio" name="rating" value="2" {...register("rating")} id="rating-2"/>
                                        <label htmlFor="rating-2"></label>
                                        <input type="radio" name="rating" value="1" {...register("rating")} id="rating-1"/>
                                        <label htmlFor="rating-1"></label>
                                    </div>
                                ) : (
                                    <a onClick={selectRating}>
                                        평가하기
                                    </a>
                                )}
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