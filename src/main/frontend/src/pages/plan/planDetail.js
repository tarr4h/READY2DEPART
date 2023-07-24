import {useLocation} from "react-router-dom";
import {useEffect, useState} from "react";
import axios from "axios";


function PlanDetail(){

    const location = useLocation();
    const plan = location.state.plan;

    const [doList, setDoList] = useState([]);

    useEffect(() => {
        console.log('plan : ', plan);
        void getDoList();
    },[]);

    const getDoList = async () => {
        const list = await(await axios.get('/pln/selectDoList', {
            params : {
                dayId : plan.id
            }
        })).data;

        setDoList(list);
    }

    

    return (
        <div>
            planDetail, planId : {plan.id}
        </div>
    )
}

export default PlanDetail;