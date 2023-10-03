import {useEffect, useState} from "react";
import axios from "axios";

function BoardCategoryDetail({sysCd, setSysCd, register, setRegisterVal, selectedCtgr}){

    const [categoryList, setCategoryList] = useState([]);

    useEffect(() => {
        setRegisterVal('categoryDetail', null);
        setCategoryList([]);
        void ctgrDetailList();
    }, [sysCd]);

    const ctgrDetailList = async () => {
        const result = await(await axios.get('/register/selectBoardCategory', {
            params : {
                sysCd
            }
        })).data;
        if(result.length === 0){
            setSysCd('');
        }
        setCategoryList(result);
    }


    return (
        <div className="categoryDetailWrapper">
            {categoryList.map((ctgr, index) => (
                <div className="categoryDetail" key={index}>
                    <input type="radio"
                           id={ctgr.sysCd}
                           name="categoryDetail"
                           value={ctgr.sysCd}
                           defaultChecked={selectedCtgr != null ? ctgr.sysCd === selectedCtgr.sysCd : null}
                           {...register('categoryDetail')}
                    />
                    <label htmlFor={ctgr.sysCd}>{ctgr.nm}</label>
                </div>
            ))}
        </div>
    )
}

export default BoardCategoryDetail;