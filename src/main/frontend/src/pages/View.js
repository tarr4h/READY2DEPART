import My from "./my/my";
import Main from "./main/main";
import ErrPage from "./ErrPage";
import Register from "./main/register";
import BoardDetail from "./board/boardDetail";
import Plan from "./plan/plan";
import PlanDetail from "./plan/day/planDetail";
import Login from "./login/Login";


function View({page}){
    switch(page) {
        case 'my' :
            return <My/>;
        case 'login' :
            return <Login/>;
        case 'home':
            return <Main/>;
        case 'register':
            return <Register/>;
        case 'boardDetail':
            return <BoardDetail/>;
        case 'plan':
            return <Plan/>;
        case 'planDetail':
            return <PlanDetail/>;
        default :
            return <ErrPage/>;
    }
}

export default View;