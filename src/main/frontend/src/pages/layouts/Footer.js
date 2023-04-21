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
            <NavLink to={'/group'}>
                GROUP
            </NavLink>
            <NavLink to={'/my'}>
                MY
            </NavLink>
        </div>
    )
}

export default Footer;