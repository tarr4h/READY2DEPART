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
        <div className="flex j_between pl_3 pt_3 pr_3">
            <div className="pageTit orange">
                MY
            </div>
            <a className="btn bd_orange orange" onClick={logout}>LOGOUT</a>
        </div>
    )
}

export default My;