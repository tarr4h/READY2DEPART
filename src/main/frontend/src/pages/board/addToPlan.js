import {useEffect, useState} from "react";
import Home from "../Home";
import Modal from "../comn/Modal";
import AddPlanModal from "./addPlanModal";
import SelectPlanModal from "./selectPlanModal";

function AddToPlan(){

    const [showModal, setShowModal] = useState(false);

    const openAddPlanModal = () => {
        setShowModal(true);
    }

    return (
        <div className="addPlanWrapper">
            <Modal title={"일정선택"}
                   content={<SelectPlanModal/>}
                   isOpen={showModal}
                   setIsOpen={setShowModal}
            />
            <a className="btn"
               onClick={openAddPlanModal}
            >계획추가</a>
        </div>
    )
}

export default AddToPlan;