import RoundImgIco from "./roundImgIco";
import {useState} from "react";

function UpdownNum({num, onChange}){

    const [inputNum, setInputNum] = useState(Number(num.current));

    async function upProcess(){
        num.current = num.current + 1;
        setInputNum(num.current);
        await onChange();
    }

    async function downProcess(){
        num.current = num.current === 1 ? 1 : num.current - 1;
        setInputNum(num.current);
        await onChange();
    }

    async function inputProcess(){
        num.current = inputNum;
        await onChange();
    }

    function inputNumOnchange(event){
        setInputNum(event.target.value);
    }

    return (
        <div style={
            {display:'flex'}
        }>
            <RoundImgIco img={'plus.png'} onClick={upProcess}/>
            <RoundImgIco img={'minus.png'} onClick={downProcess}/>
            <input type="number"
                   className="updownNumInput"
                   value={inputNum}
                   onChange={inputNumOnchange}
            />
            <RoundImgIco img={'check.png'} onClick={inputProcess}/>
        </div>
    )

}

export default UpdownNum;