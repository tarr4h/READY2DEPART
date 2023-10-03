import {useEffect, useRef, useState} from "react";
import axios from "axios";
import BoardCategoryDetail from "./boardCategoryDetail";

function BoardCategory({category, register, selectedCtgr, onClick}){

    return (
            <div className="categoryRadio">
                <input
                    type="radio"
                    name="category"
                    id={category.sysCd}
                    value={category.sysCd}
                    {...register('category')}
                    defaultChecked={selectedCtgr != null ? category.sysCd === selectedCtgr.sysCd : false}
                    onClick={onClick}
                />
                <label htmlFor={category.sysCd}>{category.nm}</label>
            </div>
    )
}

export default BoardCategory;