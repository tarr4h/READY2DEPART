import {useEffect, useState} from "react";
import React from "react";
import Tab from "./Tab";

function Tabs({children}){

    const [tabs, setTabs] = useState([]);
    const [selectedTab, setSelectedTab] = useState(0);

    useEffect(() => {
        let arr = [];
        React.Children.toArray(children).forEach((item, index) => {
           arr.push(item.props.title);
        });
        void setTabs(arr);
    }, []);

    const activeTab = (number, id) => {
        const tabContents = document.getElementsByClassName('tabContent');
        for(let i = 0; i < tabContents.length; i++){
            const tabContent = tabContents[i];
            tabContent.classList.remove('active');
        }
        document.getElementById(id).classList.add('active');
        setSelectedTab(number);
    }


    return (
        <div>
                <div className="tab roof">
                {
                    tabs.map((item, index) => (
                        <div key={index}
                             className={index === 0 ? 'tabContent active' : 'tabContent'}
                             id={'tab' + index}
                             onClick={() => {activeTab(index, 'tab'+index)}}
                        >
                            {item}
                        </div>
                    ))
                }
                </div>
            {
                React.Children.toArray(children).map((item, index) => (
                    <Tab key={index}
                         page={item.props.page}
                         active={selectedTab === index}
                    />
                ))
            }
        </div>
    )
}


export default Tabs;