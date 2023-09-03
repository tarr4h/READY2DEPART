import '../../css/Plan.css'
import PlanDayMain from "./day/planDayMain";
import {useState} from "react";
import PlanGroupMain from "./group/planGroupMain";
import Tabs from "../comn/Tabs";
import Tab from "../comn/Tab";

function Plan(){

    return (
        <Tabs>
            <Tab title={'DAILY PLAN'}
                 page={<PlanDayMain/>}
            />
            <Tab title={'GROUP'}
                 page={<PlanGroupMain/>}
            />
        </Tabs>
    )
}

export default Plan;