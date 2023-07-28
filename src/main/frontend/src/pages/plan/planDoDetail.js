import {useEffect} from "react";
import {useNavigate} from "react-router-dom";


function PlanDoDetail({planDo}) {

    const navigate = useNavigate();

    useEffect(() => {
        console.log('planDetail : ', planDo);
    });


    const showBoardDetail = () => {
        navigate('/main/boardDetail', {
            state : {
                board : planDo.board
            }
        });
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
                <div>머무르는 시간</div>
                <div>
                    <input type="number" name="" className="input wd_90"/>
                    <span className="gray ml_1">(분)</span>
                </div>
            </div>
        </div>
    )
}


export default PlanDoDetail;