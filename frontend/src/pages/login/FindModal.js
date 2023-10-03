import React, {useState} from "react";
import Tabs from "../comn/Tabs.js";
import Tab from "../comn/Tab";
import FindId from "./FindId";
import FindPw from "./FindPw";

function FindModal({callback}){

    return (
        <Tabs>
            <Tab title={'ID 찾기'}
                 page={<FindId/>}
            />
            <Tab title={'비밀번호 찾기'}
                 page={<FindPw callback={callback}/>}
            />
        </Tabs>
    )
}

export default FindModal;