import React, {useState} from "react";
import Tabs from "../comn/Tabs.js";
import Tab from "../comn/Tab";

function FindModal(){

    const page1 = () => {
        return (
            <div className="orange">
                page1content
            </div>
        )
    }
    const page2 = () => {
        return (
            <div className="orange">
                page2content
            </div>
        )
    }
    const page3 = () => {
        return (
            <div className="orange">
                page3content
            </div>
        )
    }

    return (
        <Tabs>
            <Tab title={'1번탭'}
                 page={page1()}
            />
            <Tab title={'2번탭'}
                 page={page2()}
            />
            <Tab title={'3번탭'}
                 page={page3()}
            />
        </Tabs>
    )
}

export default FindModal;