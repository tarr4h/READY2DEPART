import PlanRow from "./planRow";


function PlanList({planList, selectedPlanList, setSelectedPlanList, size}){

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

    return (
        planList.map((item, index) => (
            <PlanRow key={index}
                     plan={item}
                     onChange={planRowSelect}
                     size={size}
            />
        ))
    )
}

export default PlanList;