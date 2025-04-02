import { Tabs, Table, Button, Tag, Space } from 'antd';
import React from 'react';
import { RightOutlined } from '@ant-design/icons';

const Import = () => {
    const onChange = (key) => {
        console.log(key);
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

    // Sample data for the table
    const dataSource = [
        {
            key: '1',
            order: 1,
            date: '20/12/2025',
            time: '14:32',
            supplier: 'ສຸດທິຊາ ພໍລາວັງ',
            phoneNumber: '971823472',
            importQuantity: 8,
            receivedQuantity: 8,
            total: '8,000,000 ກີບ',
            status: 'ຢືນຢັນການນຳເຂົ້າ',
        },
    ];

    // Table columns definition
    const columns = [
        {
            title: 'ລຳດັບ',
            dataIndex: 'order',
            key: 'order',
            width: 80,
        },
        {
            title: 'ເວລາ',
            dataIndex: 'date',
            key: 'date',
            render: (text, record) => (
                <div>
                    <div>{record.date}</div>
                    <div>{record.time}</div>
                </div>
            ),
            width: 160,
            sorter: (a, b) => new Date(a.date) - new Date(b.date),
        },
        {
            title: 'ຊື່ຜູ້ສະໜອງ',
            dataIndex: 'supplier',
            key: 'supplier',
            width: 200,
        },
        {
            title: 'ເບີໂທຜູ້ສະໜອງ',
            dataIndex: 'phoneNumber',
            key: 'phoneNumber',
            width: 150,
        },
        {
            title: 'ຈຳນວນສິນຄ້ານຳເຂົ້າ',
            dataIndex: 'importQuantity',
            key: 'importQuantity',
            width: 140,
            render: (text) => (
                <div className="bg-yellow-100 text-center py-2 px-4 rounded">{text}</div>
            ),
        },
        {
            title: 'ຈຳນວນຮັບເຂົ້າ',
            dataIndex: 'receivedQuantity',
            key: 'receivedQuantity',
            width: 140,
            render: (text) => (
                <div className="bg-yellow-100 text-center py-2 px-4 rounded">{text}</div>
            ),
        },
        {
            title: 'ລາຄາລວມ',
            dataIndex: 'total',
            key: 'total',
            width: 120,
        },
        {
            title: 'ສະຖານະ',
            dataIndex: 'status',
            key: 'status',
            width: 120,
            render: (text) => (
                <Tag color="blue" className="px-4 py-1">
                    {text}
                </Tag>
            ),
        },
        {
            title: 'ຈັດການ',
            key: 'action',
            render: (_, record) => (
                <Space size="small">
                    <Button type="link" className="text-amber-500 flex items-center">
                        ລາຍລະອຽດ <RightOutlined />
                    </Button>
                </Space>
            ),
            width: 150,
        },
    ];

    return (
        <div>
            <Table
                dataSource={dataSource}
                columns={columns}
                pagination={{ pageSize: 10 }}
                // scroll={{ x: 1300 }}
                bordered
            />
        </div>
    );
};

export default Import;