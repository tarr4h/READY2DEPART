import {useEffect, useState} from "react";
import Home from "../Home";
import Modal from "../comn/Modal";

function AddPlan(){

    const [showModal, setShowModal] = useState(false);

    const [arr , setStat] = useState([1, 2, 3]);
    const [count , setCount] = useState(0);

    const planContent = () => {
        const test = () => {
            console.log('count : ', count);
            setCount(count => count + 1);
        }

        return (
            <div onClick={test}>
                {arr.map((item, index) => (
                    <input type="text" value={item}/>
                ))}
            </div>
        )
    }

    const openAddPlanModal = () => {
        setShowModal(true);
    }

    const modalCallback = () => {
        console.log('count : ',count);
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

export default AddPlan;