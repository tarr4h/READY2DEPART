import PlanDoDetail from "./planDoDetail";


function EditPlanDetail({doList}){


    return (
        <div>
            <div className="box1 bd_gray">
                <div className="subTit orange">
                    <span>기본설정</span>
                </div>
                <div className="titWrapper">
                    <div>시작시간</div>
                    <div>
                        <input type="time"
                               className="input wd_100"
                               name="startTm"/>
                    </div>
                </div>
                <div className="titWrapper">
                    <div>종료시간</div>
                    <div>
                        <input type="time"
                               className="input wd_100"
                               name="endTm"/>
                    </div>
                </div>
                <div className="titWrapper">
                    <div>출발위치</div>
                    <div>
                        <div className="flex">
                            <input type="text"
                                   className="input wd_90"
                                   name="startLocNm"/>
                            <a className="btn bd_orange orange ml_1">검색</a>
                        </div>
                    </div>
                </div>
            </div>
            <div className="box1 bd_gray mt_3">
                <div className="subTit orange">
                    <span>장소목록</span>
                </div>
                <div>
                    {
                        doList.map((item, index) => (
                            <PlanDoDetail key={index}
                                          planDo={item}/>
                        ))
                    }
                </div>
            </div>
        </div>
    )
}

export default EditPlanDetail;