import React, { useState, useEffect } from 'react';
import { Button, Space, Table, Tag, Spin, Alert, Select, message } from 'antd';
import axios from 'axios';
import ApiPath from '../../api/apiPath';
import moment from 'moment';
import { updateOrderApi } from '../../api/order';
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
}

const TableOrder = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [updatingStatus, setUpdatingStatus] = useState({});
    const navigate = useNavigate();

    const handleStatusChange = async (orderId, newStatus) => {
        setUpdatingStatus(prev => ({ ...prev, [orderId]: true }));
        const authToken = 'YOUR_AUTH_TOKEN';
        console.log(newStatus);

        try {
            await updateOrderApi(authToken, { status: newStatus }, orderId);

            setOrders(prevOrders =>
                prevOrders.map(order =>
                    order.key === orderId ? { ...order, status: newStatus } : order
                )
            );
            message.success(`ອັບເດດສະຖານະອໍເດີ ${orderId} ເປັນ ${newStatus} ສຳເລັດ`);
        } catch (err) {
            console.error("ຜິດພາດໃນການອັບເດດສະຖານະອໍເດີ:", err);
            const errorMsg = err.response?.data?.message || 'ການອັບເດດສະຖານະລົ້ມເຫລວ.';
            message.error(`ຜິດພາດໃນການອັບເດດອໍເດີ ${orderId}: ${errorMsg}`);
        } finally {
            setUpdatingStatus(prev => ({ ...prev, [orderId]: false }));
        }
    };

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
            title: 'ສະຖານະ',
            key: 'status',
            dataIndex: 'status',
            render: (status, record) => (
                <Select
                    value={status}
                    style={{ width: 150 }}
                    onChange={(newStatus) => {
                        console.log(`ສະຖານະອໍເດີ ${record.key} ປ່ຽນເປັນ: ${newStatus}`);
                        handleStatusChange(record.key, newStatus);
                    }}
                    loading={updatingStatus[record.key]}
                    disabled={updatingStatus[record.key]}
                >
                    {ORDER_STATUSES.map(stat => (
                        <Select.Option key={stat.value} value={stat.value}>
                            <Tag color={stat.color}>
                                {stat.label}
                            </Tag>
                        </Select.Option>
                    ))}
                </Select>
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
                const formattedData = response.data.map(order => ({
                    key: order.id,
                    orderID: <p className='text-center'>{order.id}</p>,
                    dateTime: moment(order.orderDate).format('DD/MM/YYYY HH:mm'),
                    employee: order.employee ? `${order.employee.fname} ${order.employee.lname}` : 'ບໍ່ມີຂໍ້ມູນ',
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
}

export default TableOrder