import '../../css/Plan.css'
import PlanDayMain from "./day/planDayMain";
import {useState} from "react";
import PlanGroupMain from "./group/planGroupMain";

function Plan(){

    const [selectedTab, setSeletedTab] = useState(1);


    const activeTab = (number, id) => {
        const tabContents = document.getElementsByClassName('tabContent');
        for(let i = 0; i < tabContents.length; i++){
            const tabContent = tabContents[i];
            tabContent.classList.remove('active');
        }
        document.getElementById(id).classList.add('active');
        setSeletedTab(number);
    }

    return (
        <div>
            <div className="tab roof">
                <div className="tabContent active"
                     id="daily"
                     onClick={(e) => {activeTab(1, 'daily')}}
                >DAILY_PLAN</div>
                <div className="tabContent"
                     id="group"
                     onClick={(e) => {activeTab(2, 'group')}}
                >GROUP</div>
            </div>
            {
                selectedTab === 1 ? <PlanDayMain/> : selectedTab === 2 ? <PlanGroupMain/> : null
            }

        </div>
    )

}

export default Plan;