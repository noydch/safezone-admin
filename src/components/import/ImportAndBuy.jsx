import { Tabs } from 'antd';
import React, { useState } from 'react'
import Buy from './Buy';
import Import from './Import';

const ImportAndBuy = () => {
    const [activeTab, setActiveTab] = useState('1');

    const onChange = (key) => {
        setActiveTab(key);
    };
    const items = [
        {
            key: '1',
            label: 'ການສັ່ງຊື້',
            // children: 'Content of Tab Pane 1',
        },
        {
            key: '2',
            label: 'ການນຳເຂົ້າ',
            // children: 'Content of Tab Pane 2',
        },
    ];
    return (
        <div className=' w-full'>
            <div className=' mb-2'>
                <Tabs defaultActiveKey="1" items={items} onChange={onChange} />
            </div>
            <div>
                {activeTab === '1' ? <Buy /> : <Import />}
            </div>
        </div>
    )
}

export default ImportAndBuy