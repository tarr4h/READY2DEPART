import {useLocation} from "react-router-dom";
import {useEffect, useState} from "react";
import axios from "axios";
import EditPlanDetail from "./planDetail_edit";
import ResultPlanDetail from "./planDetail_rslt";


function PlanDetail(){

    const location = useLocation();
    const plan = location.state.plan;

    const [doList, setDoList] = useState([]);

    const [editMode, setEditMode] = useState(false);

    useEffect(() => {
        console.log('plan : ', plan);
        void getDoList();
    },[]);

    const getDoList = async () => {
        const list = await(await axios.get('/pln/selectDoList', {
            params : {
                dayId : plan.id
            }
        })).data;

        setDoList(list);
    }

    const chngEditMode = () => {
        setEditMode((current) => (!current));
    }

    

    return (
        <div>
            <div className="planTitWrapper pt_3 pl_3 pr_3 pb_3">
                <div className="pageTit orange fw_500">
                    {plan.nm}
                </div>
                <div>
                    {editMode ?
                        (<a className="btn bg_orange bd_orange"
                            onClick={chngEditMode}
                        >저장</a>)
                        :
                        (<a className="btn orange bd_orange"
                            onClick={chngEditMode}
                        >수정</a>)
                    }
                </div>
            </div>
            <div className="planDetailBody">
                {editMode ?
                    (<EditPlanDetail/>)
                    :
                    (<ResultPlanDetail/>)
                }
            </div>
            {
                doList.map((item, index) => (
                    <div key={index}>
                        {item.board.title}
                    </div>
                ))
            }
        </div>
    )
}

export default PlanDetail;