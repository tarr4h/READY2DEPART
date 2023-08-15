import {useLocation} from "react-router-dom";
import {useEffect, useState} from "react";
import axios, {formToJSON} from "axios";
import EditPlanDetail from "./planDetail_edit";
import ResultPlanDetail from "./planDetail_rslt";
import {useForm} from "react-hook-form";
import * as comn from "../../comn/comnFunction";


function PlanDetail(){

    const location = useLocation();
    const [plan, setPlan] = useState(location.state.plan);

    const [doList, setDoList] = useState([]);
    const [editMode, setEditMode] = useState(false);

    const {register, setValue, handleSubmit} = useForm();
    const [stayTmList, setStayTmList] = useState([]);

    const [reArranged, setReArranged] = useState(false);

    useEffect(() => {
        void getDoList();
    },[]);

    const getPlan = async() => {
        const result = await(await axios.get('/pln/selectPlan', {
            params : {
                id : plan.id
            }
        })).data;
        setPlan(result);
    }

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
        if(!editMode) return false;
        data.id = plan.id;

        if(data.startLocNm === '' || data.startLocLat === '' || data.startLocLng === ''){
            alert('출발위치 지정 시 저장 가능합니다.');
            return false;
        }

        if(stayTmList.length !== 0){
            data.stayTmList = stayTmList;
            const restricted = await(await axios.post('/pln/checkStayTmRestrict', data)).data;
            if(!restricted.bool){
                alert('총 소요시간이 설정한 시간보다 '+restricted.overTm +'분 만큼 초과되었습니다.');
                return false;
            }
        }

        comn.blockUI();
        await(await axios.post('/pln/updatePlanDay', data)).data;
        chngEditMode();
        void getDoList();
        void getPlan();
        comn.unBlockUI();
    }

    const saveReArrange = async() => {
        const param = {
            id : plan.id,
            dayId : plan.id,
            doList
        }
        comn.blockUI();
        const result = await (await axios.post('/pln/saveReArrange', param)).data;
        alert(result + '건이 변경되었습니다.');
        await setReArranged(false);
        void getDoList();
        void getPlan();
        comn.unBlockUI();
    }


    return (
        <div className="pr_3 pl_3">
            <div className="planTitWrapper pt_3 pb_3">
                <div className="pageTit orange fw_500">
                    {plan.nm}
                </div>
                <div>
                    {editMode ?
                        (
                            <a className="btn bg_orange bd_orange"
                            onClick={handleSubmit(submitEditing)}
                            >저장</a>
                        )
                        :
                        (
                            <div className="flex j_between">
                                {
                                    reArranged ?
                                        (
                                            <a className="btn gray mr_1"
                                               onClick={saveReArrange}
                                            >순번저장</a>
                                        )
                                        :
                                        null
                                }
                                <a className="btn orange bd_orange"
                                onClick={chngEditMode}
                                >수정</a>
                            </div>
                        )
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
                    (<ResultPlanDetail plan={plan}
                                       setDoList={setDoList}
                                       doList={doList}
                                       reArranged={reArranged}
                                       setReArranged={setReArranged}
                    />)
                }
            </div>
        </div>
    )
}

export default PlanDetail;