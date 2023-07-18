import {useEffect, useState} from "react";
import Home from "../Home";
import Modal from "../comn/Modal";
import AddPlanModal from "./addPlanModal";

function AddToPlan(){

    const [showModal, setShowModal] = useState(false);


    const planContent = () => {

        return (
            <div>
                <AddPlanModal/>
            </div>
        )
    }

    const openAddPlanModal = () => {
        setShowModal(true);
    }

    const modalCallback = () => {
        setShowModal(false);
    }

    return (
        <div className="addPlanWrapper">
            {
                showModal ?
                    <Modal title={"일정선택"}
                           content={planContent()}
                           callback={modalCallback}
                    /> : ''
            }
            <a className="btn"
               onClick={openAddPlanModal}
            >계획추가</a>
        </div>
    )
}

export default AddToPlan;