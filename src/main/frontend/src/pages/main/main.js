import BoardList from "../board/boardList";
import {useEffect, useState} from "react";
import * as comn from "../../comn/comnFunction";
import MainMap from "./mainMap";

function Main(){

    useEffect(() => {
        comn.scrollToTop();

    }, [])

    return (
        <div>
            <MainMap/>
            <BoardList/>
        </div>
    )
}

export default Main;