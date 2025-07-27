import { Tabs } from 'antd';
import React, { useState } from 'react'
import Buy from './Buy';
import Import from './Import';
import useSafezoneStore from '../../store/safezoneStore'; // Import useSafezoneStore
import { Result } from 'antd'; // Import Result component

const ImportAndBuy = () => {
    const [activeTab, setActiveTab] = useState('1');
    const user = useSafezoneStore((state) => state.user); // Get user from store

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
            {/* Add role check here */}
            {user.role !== 'Admin' && user.role !== 'Manager' ? (
                <Result
                    status="403"
                    title="403"
                    subTitle="ທ່ານບໍ່ມີສິດໃນການເບິ່ງຂໍ້ມູນນີ້!"
                    extra={
                        <p className="text-gray-600">ກະລຸນາຕິດຕໍ່ຜູ້ເບິ່ງແຍງລະບົບຖ້າທ່ານຄິດວ່ານີ້ແມ່ນຂໍ້ຜິດພາດ.</p>
                    }
                />
            ) : (
                <>
                    <div className=' mb-2'>
                        <Tabs defaultActiveKey="1" items={items} onChange={onChange} />
                    </div>
                    <div>
                        {activeTab === '1' ? <Buy /> : <Import />}
                    </div>
                </>
            )}
        </div>
    )
}

export default ImportAndBuy