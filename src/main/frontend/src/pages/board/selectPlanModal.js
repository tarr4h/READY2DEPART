import Modal from "../comn/Modal";
import AddPlanModal from "./addPlanModal";
import {useState} from "react";


function SelectPlanModal(){

    const [showAddModal, setShowAddModal] = useState(false);

    const openAddPlanModal = () => {
        setShowAddModal(true);
    }

    return (
        <div>
            <Modal title={"일정추가"}
                   content={<AddPlanModal/>}
                   isOpen={showAddModal}
                   setIsOpen={setShowAddModal}
            />
            test1<br/>
            test2<br/>
            test3<br/>
            <a className="btn"
               onClick={openAddPlanModal}
            >추가</a>
        </div>
    );
}

export default SelectPlanModal;