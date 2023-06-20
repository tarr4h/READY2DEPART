import {useEffect, useState} from "react";
import axios from "axios";
import RegionSelect from "./regionSelect";

function SearchFilter({submit, reset}){

    const [region1, setRegion1] = useState([]);
    const [region2, setRegion2] = useState([]);

    const [selectedRegion1, setSelectedRegion1] = useState('');
    const [selectedRegion2, setSelectedRegion2] = useState('');

    useEffect(() => {
        void selectRegion1List();

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

    const region1Onchange = async (event) => {
        let val = event.target.value;
        setSelectedRegion1(val);
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

    const responseFilter = () => {
        const region = {
            region1 : selectedRegion1,
            region2 : selectedRegion2
        }
        submit(region);
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
            <div>
                <div>장소</div>
                <div>
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
            </div>
            <a className="btn" onClick={responseFilter}>적용</a>
            <a className="btn" onClick={resetFilter}>초기화</a>
        </div>
    )
}

export default SearchFilter;