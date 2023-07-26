import {useNavigate} from "react-router-dom";

function My(){
    const navigate = useNavigate();

    function logout(){
        fetch('/auth/logout', {
            method: 'POST'
        }).then(() => {
            window.localStorage.removeItem('currGeoLoc');
            navigate('/login');
        });
    }

    return (
        <div>
            <h3>MY</h3>
            <button onClick={logout}>LOGOUT</button>
        </div>
    )
}

export default My;