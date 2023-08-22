import {useEffect, useState} from "react";
import axios from "axios";
import RegionSelect from "./regionSelect";
import CategorySelect from "./categorySelect";

function SearchFilter({submit, reset}){

    const [region1, setRegion1] = useState([]);
    const [region2, setRegion2] = useState([]);
    const [addInfo, setAddInfo] = useState([]);

    const [selectedRegion1, setSelectedRegion1] = useState('');
    const [selectedRegion2, setSelectedRegion2] = useState('');
    const [selectedAddInfo, setSelectedAddInfo] = useState([]);

    const [type1, setType1] = useState([]);
    const [type2, setType2] = useState([]);
    const [selectedType1, setSelectedType1] = useState('');
    const [selectedType2, setSelectedType2] = useState('');

    useEffect(() => {
        void selectRegion1List();
        void selectType1List();
        void selectAddInfo();

        let filterRegion = JSON.parse(window.localStorage.getItem('filterRegion'));
        if(filterRegion != null){
            if(filterRegion.region1 !== ''){
                setSelectedRegion1(filterRegion.region1);
            }
            if(filterRegion.region2 !== ''){
                setSelectedRegion2(filterRegion.region2);
            }
        }

        let filterCtgr = JSON.parse(window.localStorage.getItem('filterCtgr'));
        if(filterCtgr != null){
            if(filterCtgr.ctgr1 !== ''){
                setSelectedType1(filterCtgr.ctgr1);
            }
            if(filterCtgr.ctgr2 !== ''){
                setSelectedType2(filterCtgr.ctgr2);
            }
        }

        let filterAddInfo = JSON.parse(window.localStorage.getItem('filterAddInfo'));
        if(filterAddInfo != null){
            void setSelectedAddInfo(filterAddInfo);
        }
    }, []);

    const selectRegion1List = async () => {
        const list = await(await axios.get('/district/selectRegion1', {
            method : 'GET'
        })).data;
        setRegion1(list);
    }

    const selectRegion2List = async (region1) => {
        const list = await(await axios.get('/district/selectRegion2', {
            method : 'GET',
            params : {
                region1 : region1
            }
        })).data;
        setRegion2(list);
    }

    const region1Onchange = async (event) => {
        let val = event.target.value;
        setSelectedRegion1(val);
        setSelectedRegion2('');
        await selectRegion2List(val);
    }

    const region1SetValue = async (val) => {
        setSelectedRegion1(val);
        await selectRegion2List(val);
    }

    const region2Onchange = async (event) => {
        let val = event.target.value;
        setSelectedRegion2(val);
    }

    const selectType1List = async () => {
        const list = await(await axios.get('/district/selectType1', {
            method : 'GET'
        })).data;
        setType1(list);
    }

    const selectType2List = async (type1) => {
        const list = await(await axios.get('/district/selectType2', {
            method : 'GET',
            params : {
                upSysCd : type1
            }
        })).data;
        setType2(list);
    }

    const selectType1Onchange = async (event) => {
        const val = event.target.value;
        setSelectedType1(val);
        setSelectedType2('');
        await selectType2List(val);
    }

    const selectType2Onchange = async (event) => {
        const val = event.target.value;
        setSelectedType2(val);
    }

    const selectType1SetValue = async (value) => {
        await selectType2List(value);
    }

    const selectAddInfo = async () => {
        const list = await(await axios.get('/district/selectAddInfo', {
            method : 'GET',
        })).data;
        setAddInfo(list);
    }

    const addInfoOnChange = async (event) => {
        const checked = event.target.checked;
        const value = event.target.value;

        let exist = false;
        let existIndex = 0;
        selectedAddInfo.forEach((sysCd, index) => {
           if(sysCd === value){
               exist = true;
               existIndex = index;
               return false;
           }
        });
        if(checked && !exist){
            selectedAddInfo.push(value);
        } else if(!checked && exist){
            selectedAddInfo.splice(existIndex, 1);
        }
        await setSelectedAddInfo(selectedAddInfo);
        console.log('selectedAddInfo : ',selectedAddInfo);
    }

    const isAddInfoChecked = (sysCd) => {
        let bool = false;
        selectedAddInfo.forEach((item) => {
            if(item === sysCd){
                bool = true;
                return false;
            }
        });
        return bool;
    }

    const responseFilter = () => {
        const region = {
            region1 : selectedRegion1,
            region2 : selectedRegion2
        }
        const category = {
            ctgr1 : selectedType1,
            ctgr2 : selectedType2
        }

        submit(region, category, selectedAddInfo);
    }

    const resetFilter = () => {
        setSelectedRegion1('');
        setSelectedRegion2('');
        void selectRegion1List();
        void selectRegion2List();
        reset();
    }
    
    return (
        <div className="mainScFilter">
            <div className="titWrapper">
                <div>장소</div>
                <div className="select_half_wrapper">
                    <RegionSelect region={region1}
                                  onChange={region1Onchange}
                                  setValue={region1SetValue}
                                  selectedRegion={selectedRegion1}
                    />
                    <RegionSelect region={region2}
                                  onChange={region2Onchange}
                                  selectedRegion={selectedRegion2}
                    />
                </div>
            </div>
            <div className="titWrapper">
                <div>유형</div>
                <div className="select_half_wrapper">
                    <CategorySelect category={type1}
                                    onChange={selectType1Onchange}
                                    setValue={selectType1SetValue}
                                    selectedCategory={selectedType1}
                    />
                    <CategorySelect category={type2}
                                    onChange={selectType2Onchange}
                                    selectedCategory={selectedType2}
                    />
                </div>
            </div>
            <div className="titWrapper">
                <div>추가정보</div>
                <div className="flex"
                     // style={{overflowX : 'scroll'}}
                >
                    {
                        addInfo.map((item, index) => (
                            (<div className="chkbox_multi"
                                  key={index}
                            >
                                <input type="checkbox"
                                       id={item.sysCd}
                                       defaultChecked={isAddInfoChecked(item.sysCd)}
                                       onChange={addInfoOnChange}
                                       value={item.sysCd}
                                />
                                <label htmlFor={item.sysCd}
                                       className="wd_20v"
                                >
                                    <span style={{display: 'block', width: '100%'}}
                                    >{item.nm}</span>
                                </label>
                            </div>)
                        ))
                    }
                </div>
            </div>
            <div className="btnWrapper_30per">
                <a className="btn gray bd_gray" onClick={resetFilter}>초기화</a>
                <a className="btn orange bd_orange" onClick={responseFilter}>적용</a>
            </div>
        </div>
    )
}

export default SearchFilter;