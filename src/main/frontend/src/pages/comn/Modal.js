import {useState} from "react";


function Modal({title, content, height, callback}){
    const [isOpen, setIsOpen] = useState(true);

    const closeModal = () => {
        setIsOpen(false);
        callback('1234');
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