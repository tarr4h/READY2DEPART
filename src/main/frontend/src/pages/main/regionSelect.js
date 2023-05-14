import {useEffect, useRef, useState} from "react";

function RegionSelect({onChange, region}){

    const selectedOpt = useRef(null);

    useEffect(() => {
        selectedOpt.current.value = '';
    }, [region]);

    return (
        <select onChange={onChange} defaultValue="def" ref={selectedOpt}>
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