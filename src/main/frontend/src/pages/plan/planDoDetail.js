import {useEffect} from "react";
import {useNavigate} from "react-router-dom";


function PlanDoDetail({planDo, openBoardDetailModal, stayTmList, setStayTmList}) {

    const showBoardDetail = () => {
        openBoardDetailModal(planDo.board);
    }

    const stayTmOnChange = (event) => {
        let stayTm = event.target.value;
        let id = planDo.id;
        let param = {
            stayTm,
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

    return (
        <div className="box1 mb_1">
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
            <div className="pl_1">
                <span>{planDo.board.summary}</span>
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