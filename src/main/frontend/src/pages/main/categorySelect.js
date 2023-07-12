import {useEffect, useRef, useState} from "react";

function CategorySelect({onChange, setValue, category, selectedCategory}){

    const selectedOpt = useRef(null);

    useEffect(() => {
        if(selectedCategory != null && selectedCategory !== ''){
            selectedOpt.current.value = selectedCategory;
            if(setValue){
                setValue(selectedCategory);
            }
        } else {
            selectedOpt.current.value = '';
        }
    }, [category]);

    return (
        <select onChange={onChange}
                defaultValue="def"
                ref={selectedOpt}
                className="select_sm"
        >
            <option value="">전체</option>
            {category.map((item, index) => (
                <option key={index}
                        value={item.sysCd}>
                    {item.nm}
                </option>
            ))}
        </select>
    )
}

export default CategorySelect;