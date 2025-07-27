import { Tabs } from 'antd';
import React, { useState } from 'react'
import ReportBuy from './ReportBuy';
import ReportImport from './ReportImport';
import ReportProduct from './ReportProduct';
import ReportSale from './ReportSale';
import ReportIncomeExpense from './ReportIncomeExpense';
import useSafezoneStore from '../../store/safezoneStore'; // Import useSafezoneStore
import { Result } from 'antd'; // Import Result component

const Reports = () => {
    const [activeTab, setActiveTab] = useState(1)
    const user = useSafezoneStore((state) => state.user); // Get user from store

    const onChange = key => {
        setActiveTab(key)
    };
    const items = [
        {
            key: '1',
            label: 'ລາຍງານໃບສັ່ງຊື້',
        },
        {
            key: '2',
            label: 'ລາຍງານການນຳເຂົ້າ',
        },
        {
            key: '3',
            label: 'ລາຍງານອາຫານເຄື່ອງດື່ມ',
        },
        {
            key: '4',
            label: 'ລາຍງານການຂາຍ',
        },
        {
            key: '5',
            label: 'ລາຍງານລາຍຮັບ - ລາຍຈ່າຍ',
        },
    ];
    return (
        <>
            {/* Add role check here */}
            {user && user.role !== 'Admin' && user.role !== 'Manager' ? (
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
                    <Tabs defaultActiveKey="1" items={items} onChange={onChange} />
                    {
                        activeTab == 1 && (
                            <ReportBuy />
                        )
                    }
                    {
                        activeTab == 2 && (
                            <ReportImport />
                        )
                    }
                    {
                        activeTab == 3 && (
                            <ReportProduct />
                        )
                    }
                    {
                        activeTab == 4 && (
                            <ReportSale />
                        )
                    }
                    {
                        activeTab == 5 && (
                            <ReportIncomeExpense />
                        )
                    }
                </>
            )}
        </>
    )
}

export default Reports