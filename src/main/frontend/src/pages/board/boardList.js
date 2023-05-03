import {useEffect, useState} from "react";
import axios from "axios";
import '../../css/Board.css';
import Board from "./board";
import {useNavigate} from "react-router-dom";

function BoardList(props){

    const navigate = useNavigate();
    const [boardList, setBoardList] = useState([]);

    useEffect(() => {
        void appendBoardList();
    }, []);

    function goRegister(){
        navigate('/my/register');
    }

    const appendBoardList = async () => {
        try{
            const result = await axios.get('/board/selectBoardList', {
                method : 'GET',
                params : {
                    test : '1234'
                }
            });
            console.log('boardList : ', result.data);
            setBoardList(result.data);
        } catch(err){

        }
    }

    return(
        <div className="boardWrapper">
            <div>
                <a className="btn" onClick={goRegister}>등록하기</a>
            </div>
            {boardList.map((board, index) => (
                <Board key={board.id} board={board}/>
            ))}
        </div>
    )

}

export default BoardList;