import {useState} from "react";


function Modal({title, content, callback}){
    const [isOpen, setIsOpen] = useState(true);

    const closeModal = () => {
        setIsOpen(false);
        callback();
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