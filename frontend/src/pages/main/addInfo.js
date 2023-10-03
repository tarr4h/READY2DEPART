import {useEffect, useState} from "react";

function AddInfo(props){
    const [addInfoList, setAddInfoList] = useState([]);

    useEffect(() => {
        selectAddInfoList();
    }, [])

    const addInfoOnchange = async (event) => {
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
        await props.setAdditionalInfo(list);
    }

    function selectAddInfoList(){
        fetch('/register/selectAddInfoList')
            .then(res => res.json())
            .then(json => {
                setAddInfoList(json);
            });
    }

    const isSelected = (sysCd, val) => {
        const selectedInfo = props.selectedAddInfo;
        if(selectedInfo === null){
            return val === 'N';
        }

        let bool = false;
        let correntCnt = 0;
        selectedInfo.forEach((item, index) => {
            if(sysCd === item.sysCd) {
                if(val === item.val){
                    bool = true;
                }
                correntCnt++;
            }
        });
        if(bool === false && correntCnt === 0 && val === 'N') bool = true;
        return bool;
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
                            defaultChecked={isSelected(item.sysCd, 'Y')}
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
                            defaultChecked={isSelected(item.sysCd, 'N')}
                            onChange={addInfoOnchange}
                        />
                        <label htmlFor={item.val + 'N'}>불가능</label>
                    </div>
                </div>
            ))}
        </div>
    )

}

export default AddInfo;