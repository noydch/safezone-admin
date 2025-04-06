import { Tabs, Table, Button, Tag, Space, Spin, Alert, message } from 'antd';
import React, { useState, useEffect, useCallback } from 'react';
import { RightOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import ApiPath from '../../api/apiPath';
import ModalCreatePurchaseOrder from './ModalBuy';
import moment from 'moment';

const Buy = () => {
    const navigate = useNavigate();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [purchaseOrders, setPurchaseOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchPurchaseOrders = useCallback(async () => {
        console.log("Fetching purchase orders...");
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get(ApiPath.getPurchaseOrders);
            setPurchaseOrders(response.data.map(po => ({ ...po, key: po.id })));
        } catch (err) {
            console.error("Error fetching purchase orders:", err);
            setError('Failed to load purchase orders. Please try again later.');
            message.error('Failed to load purchase orders.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchPurchaseOrders();
    }, [fetchPurchaseOrders]);

    const handleOpenModal = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const handlePurchaseOrderCreated = () => {
        fetchPurchaseOrders();
    };

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

    const columns = [
        {
            title: 'ລຳດັບ PO',
            dataIndex: 'id',
            key: 'id',
            width: 100,
        },
        {
            title: 'ເວລາສັ່ງຊື້',
            dataIndex: 'orderDate',
            key: 'orderDate',
            render: (text) => moment(text).format('DD/MM/YYYY HH:mm'),
            width: 160,
            sorter: (a, b) => moment(a.orderDate) - moment(b.orderDate),
        },
        {
            title: 'ຊື່ຜູ້ສະໜອງ',
            dataIndex: ['supplier', 'name'],
            key: 'supplierName',
            render: (name, record) => name || `Supplier ID: ${record.supplierId}`,
            width: 200,
        },
        {
            title: 'ຈຳນວນ (ລາຍການ)',
            dataIndex: 'details',
            key: 'itemCount',
            width: 140,
            render: (details) => (
                <div className="bg-yellow-100 text-center py-1 px-2 rounded">
                    {details?.length || 0} ລາຍການ
                </div>
            ),
        },
        {
            title: 'ລາຄາລວມ',
            dataIndex: 'totalPrice',
            key: 'totalPrice',
            width: 150,
            render: (price) => `${(price || 0).toLocaleString()} ກີບ`,
        },
        {
            title: 'ສະຖານະ',
            dataIndex: 'status',
            key: 'status',
            width: 120,
            render: (status) => {
                let color;
                switch (status) {
                    case 'pending': color = 'orange'; break;
                    case 'approved': color = 'green'; break;
                    case 'cancelled': color = 'red'; break;
                    default: color = 'default';
                }
                return (
                    <Tag color={color} key={status}>
                        {status?.toUpperCase() || 'UNKNOWN'}
                    </Tag>
                );
            },
            filters: [
                { text: 'Pending', value: 'pending' },
                { text: 'Approved', value: 'approved' },
                { text: 'Cancelled', value: 'cancelled' },
            ],
            onFilter: (value, record) => record.status.indexOf(value) === 0,
        },
        {
            title: 'ຈັດການ',
            key: 'action',
            fixed: 'right',
            width: 200,
            render: (_, record) => (
                <Space size="small">
                    <Button type="primary" disabled={record.status !== 'pending'} onClick={() => console.log('Approve PO:', record.id)}>ອະນຸມັດ</Button>
                    <Button danger disabled={record.status !== 'pending'} onClick={() => console.log('Cancel PO:', record.id)}>ຍົກເລີກ</Button>
                    <Button
                        type="link"
                        className="text-amber-500 flex items-center"
                        onClick={() => navigate(`/buy-detail/${record.id}`)}
                    >
                        ລາຍລະອຽດ <RightOutlined />
                    </Button>
                </Space>
            ),
        },
    ];

    if (loading && purchaseOrders.length === 0) {
        return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}><Spin size="large" /></div>;
    }

    if (error && purchaseOrders.length === 0) {
        return <Alert message="Error Loading Data" description={error} type="error" showIcon />;
    }

    return (
        <div className=' bg-white rounded-md p-4'>
            <h1 className='text-[20px] font-semibold mb-2'>ລາຍການສັ່ງຊື້ (Purchase Orders)</h1>
            <div className='flex justify-end mb-4'>
                <button
                    onClick={handleOpenModal}
                    className='h-[40px] w-[150px] font-medium rounded bg-red-500 text-center text-white border-2 border-transparent hover:border-2 hover:bg-transparent hover:border-red-500 hover:text-red-500 duration-300 cursor-pointer'>
                    + ເພີ່ມລາຍການສັ່ງຊື້
                </button>
                <ModalCreatePurchaseOrder
                    visible={isModalOpen}
                    onClose={handleCloseModal}
                    onPurchaseOrderCreated={handlePurchaseOrderCreated}
                />
            </div>
            {error && <Alert message="Error" description={error} type="error" showIcon style={{ marginBottom: 16 }} />}
            <Table
                dataSource={purchaseOrders}
                columns={columns}
                pagination={{ pageSize: 10 }}
                loading={loading}
                bordered
            // scroll={{ x: 1300 }}
            />
        </div>
    );
};

export default Buy;