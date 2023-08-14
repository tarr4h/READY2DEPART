import {useEffect} from "react";
import {useNavigate} from "react-router-dom";
import plan from "./plan";
import RoundImgIco from "../comn/roundImgIco";


function PlanDoDetail({planDo, openBoardDetailModal, stayTmList, setStayTmList, changeOrdr}) {

    useEffect(() => {
        if(planDo.stayTmMin != null){
            let exist = true;
            stayTmList.forEach((item, index) => {
                if(item.id === planDo.id){
                    exist = false;
                }
            });

            if(exist){
                const param = {
                    stayTm : planDo.stayTmMin,
                    id : planDo.id
                }

                stayTmList.push(param);
                setStayTmList(stayTmList);
            }
        }
    }, []);

    const showBoardDetail = () => {
        openBoardDetailModal(planDo.board);
    }

    const stayTmOnChange = (event) => {
        let stayTm = event.target.value;
        if(Number(stayTm) < 0){  // prevent minus value
            alert('0 이하는 입력하실 수 없습니다.');
            return false;
        }

        let id = planDo.id;
        let param = {
            stayTm : Number(stayTm),
            id
        }

        stayTmList.forEach((item, index) => {
           if(item.id === id){
               stayTmList.splice(index, 1);
           }
        });
        stayTmList.push(param);
        setStayTmList(stayTmList);
    }

    const toUp = () => {
        changeOrdr(planDo.ordr, true);
    }

    const toDown = () => {
        changeOrdr(planDo.ordr, false);
    }

    return (
        <div className="box1 mb_1 bd_gray gray">
            <div className="flex j_between">
                <div className="subTit"
                     onClick={showBoardDetail}
                >
                    <span>{planDo.board.title}</span>
                </div>
                <div className="subTit">
                    <span>{planDo.board.categoryVo.nm}</span>
                </div>
            </div>
            <div className="flex j_between pl_1">
                <span>{planDo.board.summary}</span>
                {
                    planDo.ordr !== 9999 ? (
                        <div className="flex">
                            {
                                planDo.ordr !== 1 ? (
                                    <RoundImgIco img={'angle-double-small-up.png'}
                                                 onClick={toUp}
                                    />
                                ) : null
                            }
                            <RoundImgIco img={'angle-double-small-down.png'}
                                         onClick={toDown}
                            />
                        </div>
                        ) : null
                }
            </div>
            <div className="titWrapper mt_1">
                <div>머무르는시간</div>
                <div>
                    <input type="number"
                           onChange={stayTmOnChange}
                           defaultValue={planDo.stayTmMin == null ? 0 : planDo.stayTmMin}
                           className="input wd_90"/>
                    <span className="addTxt ml_1">(분)</span>
                </div>
            </div>
        </div>
    )
}


export default PlanDoDetail;