import {useEffect, useState} from "react";

function AddInfo(props){
    const [addInfoList, setAddInfoList] = useState([]);

    useEffect(() => {
        selectAddInfoList();
    }, [])

    const addInfoOnchange = (event) => {
        let sysCd = event.target.dataset.sysCd;
        let param = {
            sysCd : sysCd,
            val : event.target.value
        }

        let list = props.additionalInfo;
        if(list.length !== 0){
            let chk = 0;
            list.forEach((item, index) => {
               if(item.sysCd === sysCd){
                   list[index] = param;
                   chk++;
               }
            });

            if(chk === 0) list.push(param);
        } else {
            list.push(param);
        }

        props.setAdditionalInfo(list);
    }

    function selectAddInfoList(){
        fetch('/register/selectAddInfoList')
            .then(res => res.json())
            .then(json => {
                setAddInfoList(json);
            });
    }

    return (
        <div>
            {addInfoList.map((item, index) => (
                <div key={index} className="addInfo">
                    <span>{item.nm}</span>
                    <div className="addInfoRadio">
                        <input
                            type="radio"
                            id={item.val + 'Y'}
                            className="green"
                            name={item.val}
                            value="Y"
                            data-sys-cd={item.sysCd}
                            onChange={addInfoOnchange}
                        />
                        <label htmlFor={item.val + 'Y'}>가능</label>
                        <input
                            type="radio"
                            id={item.val + 'N'}
                            className="red"
                            name={item.val}
                            value="N"
                            data-sys-cd={item.sysCd}
                            onChange={addInfoOnchange}/>
                        <label htmlFor={item.val + 'N'}>불가능</label>
                    </div>
                </div>
            ))}
        </div>
    )

}

export default AddInfo;