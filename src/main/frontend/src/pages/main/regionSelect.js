import {useEffect, useRef, useState} from "react";

function RegionSelect({onChange, setValue, region, selectedRegion}){

    const selectedOpt = useRef(null);

    useEffect(() => {
        if(selectedRegion != null && selectedRegion !== ''){
            selectedOpt.current.value = selectedRegion;
            setValue(selectedRegion);
        } else {
            selectedOpt.current.value = '';
        }
    }, [region]);

    return (
        <select onChange={onChange}
                defaultValue="def"
                ref={selectedOpt}
                className="select_sm"
        >
            <option value="">전체</option>
            {region.map((item, index) => (
                <option key={index}
                        value={item}>
                    {item}
                </option>
            ))}
        </select>
    )
}

export default RegionSelect;