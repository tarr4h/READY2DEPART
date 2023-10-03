import Modal from "../comn/Modal";
import AddPlanModal from "../plan/day/addPlanModal";
import {useEffect, useState} from "react";
import axios from "axios";
import PlanRow from "../plan/day/planRow";
import PlanList from "../plan/day/planList";


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
        const list = await(await axios.get('/pln/selectMyPlanList', {
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
        const result = await(await axios.post('/pln/insertPlanDo', param)).data;
        alert(result + '건의 일정에 추가되었습니다.');
        void getPlanList();
        callback();
    };

    return (
        <div>
            <Modal title={"일정추가"}
                   content={<AddPlanModal callback={closeAddPlanModal}/>}
                   isOpen={showAddModal}
                   setIsOpen={setShowAddModal}
            />
            <PlanList planList={planList}
                      selectedPlanList={selectedPlanList}
                      setSelectedPlanList={setSelectedPlanList}
                      size={'small'}
            />
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