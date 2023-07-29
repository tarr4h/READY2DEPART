import {useLocation} from "react-router-dom";
import {useEffect, useState} from "react";
import axios, {formToJSON} from "axios";
import EditPlanDetail from "./planDetail_edit";
import ResultPlanDetail from "./planDetail_rslt";
import {useForm} from "react-hook-form";


function PlanDetail(){

    const location = useLocation();
    const plan = location.state.plan;

    const [doList, setDoList] = useState([]);
    const [editMode, setEditMode] = useState(false);

    const {register, setValue, handleSubmit} = useForm();
    const [stayTmList, setStayTmList] = useState([]);

    useEffect(() => {
        // console.log('plan : ', plan);
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

    const submitEditing = async (data) => {
        data.id = plan.id;
        data.nm = plan.nm;
        if(stayTmList.length !== 0){
            data.stayTmList = stayTmList;
        }
        console.log('data: ', data);
        const result = await(await axios.post('/pln/updatePlanDay', data)).data;
        chngEditMode();
    }


    return (
        <div className="pr_3 pl_3">
            <div className="planTitWrapper pt_3 pb_3">
                <div className="pageTit orange fw_500">
                    {plan.nm}
                </div>
                <div>
                    {editMode ?
                        (<a className="btn bg_orange bd_orange"
                            onClick={handleSubmit(submitEditing)}
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
                    (<form>
                        <EditPlanDetail plan={plan}
                                        doList={doList}
                                        register={register}
                                        setValue={setValue}
                                        stayTmList={stayTmList}
                                        setStayTmList={setStayTmList}
                        />
                    </form>)
                    :
                    (<ResultPlanDetail/>)
                }
            </div>
        </div>
    )
}

export default PlanDetail;