import Modal from "../comn/Modal";
import AddPlanModal from "../plan/addPlanModal";
import {useEffect, useState} from "react";
import axios from "axios";
import {findAllByDisplayValue} from "@testing-library/react";
import PlanRow from "./planRow";
import planRow from "./planRow";


function SelectPlanModal({boardId, callback}){

    const [showAddModal, setShowAddModal] = useState(false);
    const [planList, setPlanList] = useState([]);

    const [selectedPlanList, setSelectedPlanList] = useState([]);

    useEffect(() => {
        void getPlanList();
    }, []);

    const openAddPlanModal = () => {
        setShowAddModal(true);
    }

    const closeAddPlanModal = () => {
        setShowAddModal(false);
        void getPlanList();
    }

    const getPlanList = async () => {
        const list = await(await axios.get('/plan/selectMyPlanList', {
            params : {
                boardId
            }
        })).data;
        setPlanList(list);
    }

    const addToPlanDay = async() => {
        const param = {
            selectedPlanList,
            boardId
        }
        const result = await(await axios.post('/plan/insertPlanDo', param)).data;
        alert(result + '건의 일정에 추가되었습니다.');
        void getPlanList();
        callback();
    };

    const planRowSelect = (event) => {
        const planId = event.target.value;
        const checked = event.target.checked;
        if(checked){
            let arr = selectedPlanList;
            arr.push(planId);
            setSelectedPlanList(arr);
        } else {
            let arr = [];
            selectedPlanList.forEach((item, index) => {
               if(item !== planId){
                   arr.push(item);
               }
            });
            setSelectedPlanList(arr);
        }
    }

    return (
        <div>
            <Modal title={"일정추가"}
                   content={<AddPlanModal callback={closeAddPlanModal}/>}
                   isOpen={showAddModal}
                   setIsOpen={setShowAddModal}
            />
            {
                planList.map((item, index) => (
                    <PlanRow key={index}
                             plan={item}
                             onChange={planRowSelect}
                    />
                ))
            }
            <div className="btnWrapper_40per">
                <a className="btn orange"
                   onClick={openAddPlanModal}
                >새로운 일정등록</a>
                <a className="btn"
                   onClick={addToPlanDay}
                >선택</a>
            </div>
        </div>
    );
}

export default SelectPlanModal;