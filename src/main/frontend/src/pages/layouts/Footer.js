import {NavLink} from "react-router-dom";
import '../../css/Footer.css';

function Footer(){
    return (
        <div className="wrapper">
            <NavLink to={'/'}>
                HOME
            </NavLink>
            <NavLink to={'/friends'}>
                FRNDS
            </NavLink>
            <NavLink to={'/my/plan'}>
                PLAN
            </NavLink>
            <NavLink to={'/my'}>
                MY
            </NavLink>
        </div>
    )
}

export default Footer;