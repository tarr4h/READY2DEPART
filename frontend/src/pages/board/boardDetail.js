import {useLocation} from "react-router-dom";
import '../../css/BoardDetail.css';
import * as comn from "../../comn/comnFunction";
import BoardDetailContent from "./boardDetailContent";
import {useEffect} from "react";
import AddToPlan from "./addToPlan";

function BoardDetail(){

    const location = useLocation();
    const board = location.state.board;

    useEffect(() => {
        comn.scrollToTop();
    }, [])

    return (
        <div>
            <BoardDetailContent board={board}/>
        </div>
    )
}

export default BoardDetail;