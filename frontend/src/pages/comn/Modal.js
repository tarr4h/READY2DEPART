import {useEffect, useState} from "react";
import * as comn from "../../comn/comnFunction";


function Modal({title, content, isOpen, setIsOpen}){
    const closeModal = () => {
        setIsOpen(false);
    }

    return (
        <div className={
            isOpen ? "modal openModal" : "modal"
        }>
            <div className="modalWrapper">
                <div className="modalHeader">
                    <div>
                        {title}
                    </div>
                    <div
                       onClick={closeModal}
                    >X</div>
                </div>
                <div className="modalContent"
                >
                    {content}
                </div>
            </div>
        </div>
    )
}

export default Modal;