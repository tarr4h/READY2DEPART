import axios from "axios";
import {useEffect, useLayoutEffect, useState} from "react";
import PlanRow from "./planRow";
import '../../css/Plan.css'
import PlanList from "./planList";
import Modal from "../comn/Modal";
import AddPlanModal from "./addPlanModal";


function Plan(){

    const [planList, setPlanList] = useState([]);
    const [selectedPlanList, setSelectedPlanList] = useState([]);
    const [showAddModal, setShowAddModal] = useState(false);

    const [showDelBtn, setShowDelBtn] = useState(false);

    useEffect(() => {
        void getPlanList();
    }, []);

    useEffect(() => {
        if(selectedPlanList.length > 0){
            setShowDelBtn(true);
        } else {
            setShowDelBtn(false);
        }
    }, [selectedPlanList]);

    const openAddPlanModal = () => {
        setShowAddModal(true);
    }

    const closeAddPlanModal = () => {
        setShowAddModal(false);
        void getPlanList();
    }

    const getPlanList = async () => {
        const list = await(await axios.get('/pln/selectMyPlanList')).data;
        if(list.length === 0) setShowDelBtn(false);
        setPlanList(list);
    }

    const deletePlan = async () => {
        const result = await(await axios.post('/pln/deletePlanDay', {
            selectedPlanList
        })).data;

        alert(result + '건이 삭제되었습니다.');
        void getPlanList();
    }

    return (
        <div>
            <Modal title={"일정추가"}
                   content={<AddPlanModal callback={closeAddPlanModal}/>}
                   isOpen={showAddModal}
                   setIsOpen={setShowAddModal}
            />
            <div className="planTitWrapper pt_3 pl_3 pr_3 pb_3">
                <div className="pageTit orange">
                    PLAN
                </div>
                <div>
                    <a className="btn bg_orange bd_orange"
                       onClick={openAddPlanModal}
                    >추가하기</a>
                    {
                        showDelBtn ? <a className="btn orange bd_orange ml_1"
                                        onClick={deletePlan}
                                        >삭제</a> : ''
                    }
                </div>
            </div>
            <PlanList planList={planList}
                      selectedPlanList={selectedPlanList}
                      setSelectedPlanList={setSelectedPlanList}
                      size={"big"}
            />
        </div>
    )
}

export default Plan;