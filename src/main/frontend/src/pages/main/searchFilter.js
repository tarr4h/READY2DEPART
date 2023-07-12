import {useEffect, useState} from "react";
import axios from "axios";
import RegionSelect from "./regionSelect";
import CategorySelect from "./categorySelect";

function SearchFilter({submit, reset}){

    const [region1, setRegion1] = useState([]);
    const [region2, setRegion2] = useState([]);

    const [selectedRegion1, setSelectedRegion1] = useState('');
    const [selectedRegion2, setSelectedRegion2] = useState('');

    const [type1, setType1] = useState([]);
    const [type2, setType2] = useState([]);
    const [selectedType1, setSelectedType1] = useState('');
    const [selectedType2, setSelectedType2] = useState('');

    useEffect(() => {
        void selectRegion1List();
        void selectType1List();

        let filterRegion = JSON.parse(window.localStorage.getItem('filterRegion'));
        if(filterRegion != null){
            if(filterRegion.region1 !== ''){
                setSelectedRegion1(filterRegion.region1);
            }
            if(filterRegion.region2 !== ''){
                setSelectedRegion2(filterRegion.region2);
            }
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

    const region1Onchange = async (event) => {
        let val = event.target.value;
        setSelectedRegion1(val);
        await selectRegion2List(val);
    }

    const type1Onchange = async (event) => {
        let val = event.target.value;
        setSelectedType1(val);
        await selectType2List(val);
    }

    const region1SetValue = async (val) => {
        setSelectedRegion1(val);
        await selectRegion2List(val);
    }

    const type1SetValue = async (val) => {
        setSelectedType1(val);
        await selectType1List(val);
    }


    const type2SetValue = async (val) => {
        setSelectedType1(val);
        await selectType2List(val);
    }

    const region2Onchange = async (event) => {
        let val = event.target.value;
        setSelectedRegion2(val);
    }

    const type2Onchange = async (event) => {
        let val = event.target.value;
        setSelectedType2(val);
    }

    const responseFilter = () => {
        const region = {
            region1 : selectedRegion1,
            region2 : selectedRegion2
        }
        const category = {
            ctgr1 : selectedType1,
            ctgr2 : selectedType2
        };
        submit(region, category);
    }

    const resetFilter = () => {
        setSelectedRegion1('');
        setSelectedRegion2('');
        setSelectedType1('');
        setSelectedType2('');
        void selectRegion1List();
        void selectRegion2List();
        void selectType1List();
        void selectType2List();
        reset();
    }
    
    return (
        <div className="mainScFilter">
            <div>
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
            <div>
                <div>유형</div>
                <div className="select_half_wrapper">
                    <CategorySelect category={type1}
                                  onChange={type1Onchange}
                                  setValue={type1SetValue}
                                  selectedCategory={selectedType1}
                    />
                    <CategorySelect category={type2}
                                  onChange={type2Onchange}
                                  setValue={type2SetValue}
                                  selectedCategory={selectedType2}
                    />
                </div>
            </div>
            <div>
                <a className="btn" onClick={resetFilter}>초기화</a>
                <a className="btn" onClick={responseFilter}>적용</a>
            </div>
        </div>
    )
}

export default SearchFilter;