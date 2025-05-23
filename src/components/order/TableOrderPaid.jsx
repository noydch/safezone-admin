import React, { useState, useEffect } from 'react';
import { Button, Space, Table, Tag, Spin, Alert, message } from 'antd';
import axios from 'axios';
import ApiPath from '../../api/apiPath';
import moment from 'moment';
import { useNavigate } from 'react-router-dom';
import useSafezoneStore from '../../store/safezoneStore';

const PAYMENT_METHODS = [
    { value: 'CASH', label: 'ເງິນສົດ', color: 'green' },
    { value: 'TRANSFER', label: 'ເງິນໂອນ', color: 'blue' },
];

const getPaymentMethodLabel = (method) => {
    const payment = PAYMENT_METHODS.find(p => p.value === method);
    return payment ? payment.label : method;
};

const getPaymentMethodColor = (method) => {
    const payment = PAYMENT_METHODS.find(p => p.value === method);
    return payment ? payment.color : 'default';
};

const TableOrderPaid = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const token = useSafezoneStore((state) => state.token);

    const columns = [
        {
            title: <p className='text-center'>ລະຫັດອໍເດີ</p>,
            dataIndex: 'orderID',
            key: 'orderID',
            render: (text) => <p className='text-center'>{text}</p>
        },
        {
            title: 'ວັນ ແລະ ເວລາ',
            dataIndex: 'dateTime',
            key: 'dateTime',
        },
        {
            title: 'ຊື່ຜູ້ສ້າງອໍເດີ',
            dataIndex: 'employee',
            key: 'employee',
        },
        {
            title: 'ເບີໂທ (ຜູ້ສ້າງ)',
            dataIndex: 'phone',
            key: 'phone',
        },
        {
            title: 'ລາຄາລວມ',
            dataIndex: 'total',
            key: 'total',
            align: 'right',
            render: (text) => <p style={{ textAlign: 'right' }}>{text}</p>
        },
        {
            title: 'ວິທີຊຳລະ',
            dataIndex: 'payment_method',
            key: 'payment_method',
            render: (method) => (
                <Tag color={getPaymentMethodColor(method)}>
                    {getPaymentMethodLabel(method)}
                </Tag>
            ),
        },
        {
            title: <p className='text-center'>ລາຍລະອຽດ</p>,
            key: 'more',
            align: 'center',
            render: (_, record) => (
                <div className='flex justify-center'>
                    <Button
                        type="default"
                        onClick={() => navigate(`/order/orderDetail/${record.orderID}`)}
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
                // กรองเฉพาะออเดอร์ที่มี payment_method
                const formattedData = response.data
                    .filter(order => order.payment_method) // กรองเฉพาะออเดอร์ที่มี payment_method
                    .map(order => ({
                        key: order.id,
                        orderID: order.id,
                        dateTime: moment(order.orderDate).format('DD/MM/YYYY HH:mm'),
                        employee: order.employee ? `${order.employee.fname} ${order.employee.lname}` : 'ບໍ່ມີຂໍ້ມູນ',
                        phone: order.employee ? order.employee.phone : 'ບໍ່ມີຂໍ້ມູນ',
                        total: (order.total_price || 0).toLocaleString() + ' ກີບ',
                        payment_method: order.payment_method,
                    }));
                setOrders(formattedData);
            } catch (err) {
                console.error("ຜິດພາດໃນການດຶງຂໍ້ມູນອໍເດີ:", err);
                const errorMsg = err.response?.data?.message || 'ການໂຫຼດຂໍ້ມູນອໍເດີລົ້ມເຫລວ. ກະລຸນາລອງໃໝ່ອີກຄັ້ງ.';
                setError(errorMsg);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

    if (loading) {
        return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 'calc(100vh - 200px)' }}><Spin size="large" /></div>;
    }

    if (error) {
        return <Alert message="ຜິດພາດ" description={error} type="error" showIcon />;
    }

    return (
        <div>
            <Table columns={columns} dataSource={orders} rowKey="key" bordered />
        </div>
    );
}

export default TableOrderPaid; 