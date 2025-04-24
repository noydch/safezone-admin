import React, { useState, useEffect } from 'react';
import { Button, Space, Table, Tag, Spin, Alert } from 'antd';
import axios from 'axios';
import ApiPath from '../../api/apiPath';
import moment from 'moment';
import { useNavigate } from 'react-router-dom';

const ORDER_STATUSES = [
    { value: 'PENDING', label: 'ລໍຖ້າຄິວ/ລໍຖ້າຄົວ', color: 'orange' },
    { value: 'COOKING', label: 'ກຳລັງປຸງແຕ່ງ', color: 'processing' },
    { value: 'READY', label: 'ພ້ອມເສີບ', color: 'cyan' },
    { value: 'SERVED', label: 'ເສີບແລ້ວ', color: 'blue' },
    { value: 'PAID', label: 'ຈ່າຍເງິນແລ້ວ', color: 'success' },
];

const getStatusColor = (statusValue) => {
    const status = ORDER_STATUSES.find(s => s.value === statusValue);
    return status ? status.color : 'default';
};

const getStatusLabel = (statusValue) => {
    const status = ORDER_STATUSES.find(s => s.value === statusValue);
    return status ? status.label : statusValue;
};

const TableDashboard = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const columns = [
        {
            title: <p className='text-center'>ລະຫັດອໍເດີ</p>,
            dataIndex: 'orderID',
            key: 'orderID',
        },
        {
            title: 'ວັນ ແລະ ເວລາ',
            dataIndex: 'dateTime',
            key: 'dateTime',
        },
        {
            title: 'ຊື່ຜູ້ຂາຍ',
            dataIndex: 'employee',
            key: 'employee',
        },
        {
            title: 'ໂຕະ',
            dataIndex: 'table',
            key: 'table',
        },
        {
            title: 'Status',
            key: 'status',
            dataIndex: 'status',
            render: (status) => (
                <Tag color={getStatusColor(status)}>
                    {getStatusLabel(status)}
                </Tag>
            ),
        },
        {
            title: 'ເບີໂທ',
            dataIndex: 'phone',
            key: 'phone',
        },
        {
            title: 'ລາຄາລວມ',
            dataIndex: 'total',
            key: 'total',
        },
        {
            title: <p className='text-center'>ລາຍລະອຽດ</p>,
            key: 'more',
            render: (_, record) => (
                <div className='flex justify-center'>
                    <Button
                        danger
                        type="primary"
                        onClick={() => navigate(`/order/orderDetail/${record.key}`)}
                    >
                        ເບິ່ງລາຍລະອຽດ
                    </Button>
                </div>
            ),
        },
    ];

    useEffect(() => {
        const fetchOrders = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await axios.get(ApiPath.getOrders);
                const formattedData = response.data
                    .filter(order => order.status !== 'PAID')
                    .map(order => ({
                        key: order.id,
                        orderID: <p className='text-center'>{order.id}</p>,
                        dateTime: moment(order.orderDate).format('DD/MM/YYYY HH:mm'),
                        employee: order.employee ? `${order.employee.fname} ${order.employee.lname}` : 'ບໍ່ມີຂໍ້ມູນ',
                        table: order.table_id || 'ບໍ່ມີຂໍ້ມູນ',
                        status: order.status,
                        phone: order.employee ? order.employee.phone : 'ບໍ່ມີຂໍ້ມູນ',
                        total: (order.total_price || 0).toLocaleString() + ' ກີບ',
                    }));
                setOrders(formattedData);
            } catch (err) {
                console.error("ຜິດພາດໃນການດຶງຂໍ້ມູນອໍເດີ:", err);
                setError('ການໂຫຼດຂໍ້ມູນອໍເດີລົ້ມເຫລວ. ກະລຸນາລອງໃໝ່ອີກຄັ້ງ.');
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

    if (loading) {
        return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}><Spin size="large" /></div>;
    }

    if (error) {
        return <Alert message="ຜິດພາດ" description={error} type="error" showIcon />;
    }

    return (
        <div>
            <Table columns={columns} dataSource={orders} rowKey="key" />
        </div>
    );
};

export default TableDashboard;