import BoardList from "../board/boardList";
import {useEffect, useState} from "react";

function Main(){

    useEffect(() => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }, [])



    return (
        <div>
            {/*<MainMap/>*/}
            <BoardList/>
        </div>
    )
}

export default Main;