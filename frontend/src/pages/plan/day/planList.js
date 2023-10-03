import PlanRow from "./planRow";
import {useEffect} from "react";


function PlanList({planList, selectedPlanList, setSelectedPlanList, size}){

    useEffect(() => {
        console.log('sorted --- ');
    }, [planList]);

    const planRowSelect = (event) => {
        const planId = event.target.value;
        const checked = event.target.checked;
        if(checked){
            let arr = [];
            selectedPlanList.forEach((item, index) => {
                arr.push(item);
            })
            arr.push(planId);
            setSelectedPlanList(arr);
        } else {
            let arr = [];
            selectedPlanList.forEach((item, index) => {
                if(item !== planId){
                    arr.push(item);
                }
            });
            setSelectedPlanList(arr);
        }
    }

    const isChecked = (planId) => {
        let result = false;
        selectedPlanList.forEach((item) => {
            if(item === planId) result = true;
            return false;
        });
        return result;
    }

    return (
        <div className="planWrapper">
            {
                planList.map((item, index) => (
                    <PlanRow key={index}
                             plan={item}
                             onChange={planRowSelect}
                             size={size}
                             isChecked={isChecked(item.id)}
                    />
                ))
            }
        </div>
    )
}

export default PlanList;