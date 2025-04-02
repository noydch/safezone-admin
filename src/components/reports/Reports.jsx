import { Tabs } from 'antd';
import React, { useState } from 'react'
import ReportBuy from './ReportBuy';
import ReportImport from './ReportImport';
import ReportProduct from './ReportProduct';
import ReportSale from './ReportSale';
import ReportIncomeExpense from './ReportIncomeExpense';

const Reports = () => {
    const [activeTab, setActiveTab] = useState(1)

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
            label: 'ລາຍງານອາຫານ ແລະ ເຄື່ອງດື່ມ',
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
    )
}

export default Reports