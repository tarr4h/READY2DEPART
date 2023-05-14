import {useEffect, useState} from "react";
import axios from "axios";
import RegionSelect from "./regionSelect";

function SearchFilter({submit}){

    const [region1, setRegion1] = useState([]);
    const [region2, setRegion2] = useState([]);

    const [selectedRegion1, setSelectedRegion1] = useState('');
    const [selectedRegion2, setSelectedRegion2] = useState('');

    useEffect(() => {
        void selectRegion1List();
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
    
    return (
        <div className="mainScFilter">
            <div>
                <div>장소</div>
                <div>
                    <RegionSelect region={region1}
                                  onChange={region1Onchange}
                    />
                    <RegionSelect region={region2}
                                  onChange={region2Onchange}
                    />
                </div>
            </div>
            <div>
                <div>유형</div>
            </div>
            <a className="btn" onClick={responseFilter}>적용</a>
        </div>
    )
}

export default SearchFilter;