import {useEffect, useRef, useState} from "react";

function CategorySelect({onChange, setValue, category, selectedCategory}){

    const selectedOpt = useRef(null);

    useEffect(() => {
        // console.log('category : ', category);
        // console.log('selectedCategory : ', selectedCategory)
        console.log('setValue : ', setValue);
        if(selectedCategory != null && selectedCategory !== ''){
            // console.log('currentValue = ', selectedOpt.current.value);
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