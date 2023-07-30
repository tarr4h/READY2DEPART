import {useState} from "react";
import Modal from "../comn/Modal";
import SelectPlanModal from "./selectPlanModal";

function AddToPlan({boardId}){

    const [showModal, setShowModal] = useState(false);

    const openAddPlanModal = () => {
        setShowModal(true);
    }

    const closeAddPlanModal = () => {
        setShowModal(false);
    }

    return (
        <div className="addPlanWrapper">
            <Modal title={"일정에 추가하기"}
                   content={<SelectPlanModal boardId={boardId}
                                             callback={closeAddPlanModal}
                   />}
                   isOpen={showModal}
                   setIsOpen={setShowModal}
            />
            <a className="btn bd_orange orange"
               onClick={openAddPlanModal}
            >일정에 추가</a>
        </div>
    )
}

export default AddToPlan;