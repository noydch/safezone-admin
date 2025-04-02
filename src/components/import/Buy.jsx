import { Tabs, Table, Button, Tag, Space, Form } from 'antd';
import React, { useState } from 'react';
import { RightOutlined } from '@ant-design/icons';
import ModalBuy from './ModalBuy';

const Buy = () => {
    const [isModalOpen, setIsModalOpen] = useState(false)

    const [form] = Form.useForm()

    const handleOpenMoal = () => {
        setIsModalOpen(true)
    }

    const handleCloseModal = () => {
        form.resetFields()
        setIsModalOpen(false)
    }

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
            invoiceNumber: '971823472',
            quantity: 8,
            total: '8,000,000 ກີບ',
            status: 'ສຳເລັດແລ້ວ',
        },
        // Add more data as needed
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
            dataIndex: 'invoiceNumber',
            key: 'invoiceNumber',
            width: 150,
        },
        {
            title: 'ຈຳນວນສິນຄ້າທັງໝົດ',
            dataIndex: 'quantity',
            key: 'quantity',
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
                <Tag color="default" className="bg-gray-200 text-gray-600 border-0 rounded px-4 py-1">
                    {text}
                </Tag>
            ),
        },
        {
            title: 'ຈັດການ',
            key: 'action',
            render: (_, record) => (
                <Space size="small">
                    <Button type="primary" className="bg-blue-500">ແກ້ໄຂ</Button>
                    <Button danger>ລົບ</Button>
                    <Button type="link" className="text-amber-500 flex items-center">
                        ລາຍລະອຽດ <RightOutlined />
                    </Button>
                </Space>
            ),
            width: 250,
        },
    ];

    return (
        <div className=' bg-white rounded-md p-4'>
            <div className='flex justify-end mb-4'>
                <button
                    onClick={handleOpenMoal}
                    className='h-[40px] w-[150px] font-medium rounded bg-red-500 text-center text-white border-2 border-transparent hover:border-2 hover:bg-transparent hover:border-red-500 hover:text-red-500 duration-300 cursor-pointer'>
                    ເພີ່ມລາຍການສັ່ງຊື້
                </button>
                <ModalBuy
                    form={form}
                    isModalOpen={isModalOpen}
                    handleCloseModal={handleCloseModal}
                />
            </div>
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

export default Buy;