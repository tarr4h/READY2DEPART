import {useCallback, useState} from "react";

export const useInput = (initValue) => {
    const [val, setVal] = useState(initValue);
    const onChange = event => {
        setVal(event.target.value);
    }
    const reset = () => {
        setVal(initValue);
    }

    return {val, onChange, setVal, reset};
}