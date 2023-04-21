import {useNavigate} from "react-router-dom";

function ErrPage(){
    const navigate = useNavigate();

    function goHome(){
        navigate('/');
    }
    return (
        <div>
            ERROR PAGE
            <button onClick={goHome}>GO HOME</button>
        </div>
    )
}

export default ErrPage;