import My from "./my/my";
import Main from "./main/main";
import {useEffect} from "react";
import ErrPage from "./ErrPage";
import Register from "./main/register";
import BoardDetail from "./board/boardDetail";


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
        default :
            return <ErrPage/>;
    }
}

export default View;