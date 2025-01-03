import '../../css/register.css';
import '../../css/Comn.css';
import {useEffect, useLayoutEffect, useRef, useState} from "react";
import {useForm} from "react-hook-form";
import AddInfo from "./addInfo";
import {useLocation, useNavigate} from "react-router-dom";
import axios from "axios";
import BoardCategory from "../board/boardCategory";
import * as comn from "../../comn/comnFunction";
import BoardCategoryDetail from "../board/boardCategoryDetail";
import Modal from "../comn/Modal";
import FindLocModal from "../comn/findLocModal";
const {kakao} = window;

function Register(){

    const navigate = useNavigate();

    const [httpPlaceholder, setHttpPlaceholder] = useState(false);
    const [searchLoc, setSearchLoc] = useState(false);
    const [showSearchModal, setShowSearchModal] = useState(false);
    const [additionalInfoView, setAdditionalInfoView] = useState(false);
    const [additionalInfo, setAdditionalInfo] = useState([]);
    const [category, setCategory] = useState([]);
    const [fileList, setFileList] = useState([]);
    const [previewList, setPreviewList] = useState([]);

    const [isRating, setIsRating] = useState(false);
    const [checkedRating, setCheckedRating] = useState(3);
    const [selectedCtgr, setSelectedCtgr] = useState('');

    const [districtInfo, setDistrictInfo] = useState({});
    const [validateLocNm, setValidateLocNm] = useState(false);

    const {register, setValue, handleSubmit} = useForm();

    const location = useLocation();
    const editMode = location.state != null;

    useEffect(() => {
        if(editMode){
            console.log('board ? : ', location.state.board);
            void setCurrentValue(location.state.board);
        } else {
            void findLocByGeoLoc();
        }

        void selectBoardCategory();
        comn.scrollToTop();
    }, []);

    const setCurrentValue = async (board) => {
        await findLocByExist(board);

        setValue('title', board.title);
        setValidateLocNm(true);
        setValue('summary', board.summary);
        setValue('content', board.content);

        if(board.upCategoryVo.upSysCd == null){
            setSelectedCtgr(board.categoryVo.sysCd);
        } else {
            setSelectedCtgr(board.upCategoryVo.sysCd);
        }

        await setCheckedRating(Number(board.rating));
        setIsRating(true);

        let addInfoArr = [];
        board.addInfoList.forEach((item, index) => {
            const param = {
                sysCd : item.sysCd,
                val : item.val
            };
            addInfoArr.push(param);
        });
        setAdditionalInfo(addInfoArr);

        const currPreviewList = board.fileList;
        let imgArr = [];
        let fileArr = [];
        currPreviewList.forEach((item, index) => {
            imgArr.push(`/board/imgView/${item.refId}/${item.id}`);
        });
        for(let i = 0; i < currPreviewList.length; i++){
            const refId = board.id;
            const flId = currPreviewList[i].id;
            const result = await(await axios.get(`/board/imgView/${refId}/${flId}`, {
                responseType : 'blob'
            })).data;
            fileArr.push(result);
        }
        await setFileList(fileArr);
        await setPreviewList(imgArr);
    }

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
        setShowSearchModal(true);
    }

    function setLocation(data){
        void setAddress(data.geoLoc);
        setSearchLoc(true);
        setShowSearchModal(false);
    }

    async function findLocByGeoLoc() {
        let geoLoc = await comn.getGeoLocation();
        if(geoLoc !== {}){
            setHttpPlaceholder(true);
        }
        if(geoLoc != null) setSearchLoc(true);
        void setAddress(geoLoc);
    }

    async function findLocByExist(board){
        setHttpPlaceholder(true);
        setSearchLoc(true);
        const geoLoc = {
            latitude : board.district.latitude,
            longitude : board.district.longitude
        }
        void setAddress(geoLoc);
    }

    async function setAddress(geoLoc){
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

        await showMap(geoLoc.latitude, geoLoc.longitude);
    }

    async function showMap(latitude, longitude){
        let {map, marker} = await comn.setMap('registerMap', latitude, longitude, true);

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

    function titleKeyup(event){
        const val = event.target.value;
        if(val === ''){
            setValidateLocNm(false);
        } else {
            setValidateLocNm(true);
        }
    }

    function uploadFileOnClick(event){
        event.target.value = null;
    }

    async function uploadFile(e){
        let newFileList = fileList;
        let appendFiles = e.target.files;
        Array.from(appendFiles).forEach(item => {
            if(item.type.includes('image')){
                newFileList.push(item);
            }
        });
        setFileList([...newFileList]);
        await appendPreview();
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

    async function appendPreview(){
        let appendPreviewList = [];
        for(let i = 0; i < fileList.length; i++){
            const result = await getFileReader(fileList[i]);
            appendPreviewList.push(result);
            setPreviewList([...appendPreviewList]);
        }
    }

    const getFileReader = (file) => {
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = async () => {
                resolve(reader.result);
            }
        })
    }

    const onSubmit = async (data) => {
        data.fileList = fileList;
        data.addInfoList = additionalInfo;
        data.district = districtInfo;

        comn.scrollToTop();
        comn.blockUI();
        let boardId = await(await insertBoard(data)).text();
        if(fileList.length > 0){
            await(await insertFile(fileList, boardId)).json();
        }
        const text = editMode ? '저장' : '등록';
        alert(text + '되었습니다.');
        comn.unBlockUI();
        navigate('/home', {replace : true});
    }

    function insertBoard(param){
        return new Promise((resolve, reject) => {
            if(editMode){
                param.boardId = location.state.board.id;
            }
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

    const selectRating = () => {
        setIsRating((current) => !current);
    }

    const ratingCheck = async (e) => {
        await setCheckedRating(Number(e.target.value));
    }

    const selectCtgr = (event) => {
        setSelectedCtgr(event.target.value);
    }

    return (
        <div className="register_whole">
            <Modal title={'장소 검색'}
                   content={<FindLocModal callback={setLocation}
                                          showModal={showSearchModal}
                   />}
                   isOpen={showSearchModal}
                   setIsOpen={setShowSearchModal}
            />
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
                                className="input wd_100"
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
                            <input className="input wd_100"
                                   onKeyUp={titleKeyup}
                                   type="text" name="title" {...register("title")}/>
                            {validateLocNm ? '' : <span className="ml_1 gray">장소명을 입력해주세요!</span>}
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
                                        selectedCtgr={editMode ?
                                            location.state.board.upCategoryVo.upSysCd == null ?
                                                location.state.board.categoryVo : location.state.board.upCategoryVo
                                            : null}
                                        onClick={selectCtgr}
                                    />
                                ))}
                            </div>
                            {selectedCtgr !== '' ?
                                <BoardCategoryDetail sysCd={selectedCtgr}
                                                     setSysCd={setSelectedCtgr}
                                                     register={register}
                                                     setRegisterVal={setValue}
                                                     selectedCtgr={editMode ?
                                                         location.state.board.categoryVo : null}
                                /> : ''}
                        </div>
                    </div>
                    <div className="line_case">
                        <div className="line_tit">
                            <span>한줄요약</span>
                        </div>
                        <div className="line_body">
                            <input className="input wd_100"
                                type="text" name="summary" {...register("summary")}/>
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
                                        <input type="radio" name="rating" value="5" {...register("rating")} id="rating-5" checked={checkedRating === 5} onClick={ratingCheck}/>
                                        <label htmlFor="rating-5"></label>
                                        <input type="radio" name="rating" value="4" {...register("rating")} id="rating-4" checked={checkedRating === 4} onClick={ratingCheck}/>
                                        <label htmlFor="rating-4"></label>
                                        <input type="radio" name="rating" value="3" {...register("rating")} id="rating-3" checked={checkedRating === 3} onClick={ratingCheck}/>
                                        <label htmlFor="rating-3"></label>
                                        <input type="radio" name="rating" value="2" {...register("rating")} id="rating-2" checked={checkedRating === 2} onClick={ratingCheck}/>
                                        <label htmlFor="rating-2"></label>
                                        <input type="radio" name="rating" value="1" {...register("rating")} id="rating-1" checked={checkedRating === 1} onClick={ratingCheck}/>
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
                                {additionalInfoView ?
                                    <AddInfo additionalInfo={additionalInfo}
                                             setAdditionalInfo={setAdditionalInfo}
                                             selectedAddInfo={editMode ? location.state.board.addInfoList : null}
                                    />
                                    : null}
                            </div>
                        </div>
                    </div>
                    <a className="registerBtn" onClick={handleSubmit(onSubmit)}>
                        {!editMode ? '등록하기' : '저장하기'}
                    </a>
                </div>
            </form>
        </div>
    )
}

export default Register;