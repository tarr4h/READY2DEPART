import {useNavigate} from "react-router-dom";

function Header(){
    const navigate = useNavigate();

    const goHome = () => {
        navigate("/");
    }

    return (
        <div>
            <h1 className={'titColor '}
                onClick={goHome}
                style={{
                    margin: '8px',
                    fontSize: '1.5rem'
                }}>
                READY2DEPART
            </h1>
        </div>
    )
}

export default Header;