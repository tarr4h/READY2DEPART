import My from "./my/my";
import Main from "./main/main";
import ErrPage from "./ErrPage";
import Register from "./main/register";
import BoardDetail from "./board/boardDetail";
import Plan from "./plan/plan";


function View({page}){
    switch(page) {
        case 'my' :
            return <My/>;
        case 'home':
            return <Main/>;
        case 'register':
            return <Register/>;
        case 'boardDetail':
            return <BoardDetail/>;
        case 'plan':
            return <Plan/>;
        default :
            return <ErrPage/>;
    }
}

export default View;