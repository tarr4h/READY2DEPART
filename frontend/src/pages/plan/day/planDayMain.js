import {useEffect, useRef, useState} from "react";
import * as comn from "../../../comn/comnFunction";
import Modal from "../../comn/Modal";
import AddPlanModal from "./addPlanModal";
import PlanList from "./planList";
import axios from "axios";


function PlanDayMain(){

    const [planList, setPlanList] = useState([]);
    const [selectedPlanList, setSelectedPlanList] = useState([]);
    const selectedSort = useRef(null);
    const [showAddModal, setShowAddModal] = useState(false);

    const [showDelBtn, setShowDelBtn] = useState(false);

    useEffect(() => {
        void getPlanList();
    }, []);

    useEffect(() => {
        if(selectedPlanList.length > 0){
            setShowDelBtn(true);
        } else {
            setShowDelBtn(false);
        }
    }, [selectedPlanList]);

    const openAddPlanModal = () => {
        setShowAddModal(true);
    }

    const closeAddPlanModal = () => {
        setShowAddModal(false);
        void getPlanList();
    }

    const getPlanList = async () => {
        const param = {
            sort : selectedSort.current
        }
        const list = await(await axios.get('/pln/selectMyPlanList', {
            params : param
        })).data;
        if(list.length === 0) setShowDelBtn(false);
        setPlanList(list);
    }

    const deletePlan = async () => {
        comn.blockUI();
        const result = await(await axios.post('/pln/deletePlanDay', {
            selectedPlanList
        })).data;

        alert(result + '건이 삭제되었습니다.');
        await getPlanList();
        setShowDelBtn(false);
        setSelectedPlanList([]);
        comn.unBlockUI();
    }

    const planSort = [
        {nm : '제목', val : 'NM'},
        {nm : '시작시간', val : 'START_TM'}
    ];

    const onSortChange = async (e) => {
        selectedSort.current = e.target.value;
        void getPlanList();
    }

    return (
        <div>
            <Modal title={"일정추가"}
                   content={<AddPlanModal callback={closeAddPlanModal}/>}
                   isOpen={showAddModal}
                   setIsOpen={setShowAddModal}
            />
            <div className="mt_2 mb_2 pr_3 pl_3 flex j_around">
                {
                    showDelBtn ?
                        <a className="btn gray bd_gray mr_1 wd_100"
                           onClick={deletePlan}
                        >삭제</a>
                        : ''
                }
                <a className="btn orange bd_orange wd_100"
                   onClick={openAddPlanModal}
                >추가하기</a>
            </div>
            <div className="sortBox pr_3 mb_2">
                <div className="sortTit">정렬</div>
                <select name="planSort"
                        className="select_sm bg_deep_gray deem"
                        onChange={onSortChange}
                >
                {
                    planSort.map((item, index) =>
                        (<option key={index} value={item.val}>{item.nm}</option>)
                    )
                }
                </select>
            </div>
            <PlanList planList={planList}
                      selectedPlanList={selectedPlanList}
                      setSelectedPlanList={setSelectedPlanList}
                      size={"big"}
            />
        </div>
    )
}


export default PlanDayMain;