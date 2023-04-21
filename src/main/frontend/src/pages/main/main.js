import {useNavigate} from "react-router-dom";

function Main(){
    const navigate = useNavigate();
    function goRegister(){
        navigate('/my/register');
    }

    return (
        <div>
            <h3>MAIN</h3>
            <a className="btn" onClick={goRegister}>등록하기</a>
        </div>
    )
}

export default Main;