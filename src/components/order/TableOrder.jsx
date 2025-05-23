import React, { useState, useEffect } from 'react';
import { Button, Space, Table, Tag, Spin, Alert, message } from 'antd';
import axios from 'axios'; // ยังคงใช้ axios สำหรับ fetchOrders
import ApiPath from '../../api/apiPath';
import moment from 'moment';
// import { updateOrderApi } from '../../api/order'; // API function สำหรับอัปเดต
import { useNavigate } from 'react-router-dom';
import useSafezoneStore from '../../store/safezoneStore';

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

// เพิ่มตัวแปรสำหรับ payment method
const PAYMENT_METHODS = [
    { value: 'CASH', label: 'ເງິນສົດ', color: 'green' },
    { value: 'TRANSFER', label: 'ເງິນໂອນ', color: 'blue' },
    { value: 'ຍັງບໍ່ທັນຊຳລະເງິນ', label: 'ຍັງບໍ່ທັນຊຳລະເງິນ', color: 'red' },
];

// เพิ่มฟังก์ชันสำหรับแสดงผล payment method
const getPaymentMethodLabel = (method) => {
    const payment = PAYMENT_METHODS.find(p => p.value === method);
    return payment ? payment.label : method;
};

const getPaymentMethodColor = (method) => {
    const payment = PAYMENT_METHODS.find(p => p.value === method);
    return payment ? payment.color : 'default';
};

const TableOrder = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [updatingStatus, setUpdatingStatus] = useState({});
    const navigate = useNavigate();
    const user = useSafezoneStore((state) => state.user);
    const token = useSafezoneStore((state) => state.token); // Move this to component level

    // Add new function to register service worker
    const registerServiceWorker = async () => {
        if ('serviceWorker' in navigator) {
            try {
                const registration = await navigator.serviceWorker.register('/service-worker.js');
                console.log('Service Worker registered with scope:', registration.scope);
            } catch (error) {
                console.error('Service Worker registration failed:', error);
            }
        }
    };

    // Add new function to send notification
    const sendNotification = async (message) => {
        if ('serviceWorker' in navigator && 'Notification' in window) {
            try {
                const permission = await Notification.requestPermission();
                if (permission === 'granted') {
                    const registration = await navigator.serviceWorker.ready;
                    await registration.showNotification('Order Status Update', {
                        body: message,
                        icon: '/icon.png',
                        badge: '/badge.png'
                    });
                }
            } catch (error) {
                console.error('Error sending notification:', error);
            }
        }
    };

    // Function to handle the API call and state update
    const handleStatusChange = async (orderId, newStatus) => {
        setUpdatingStatus(prev => ({ ...prev, [orderId]: true }));

        try {
            await updateOrderApi(token, orderId, newStatus);

            setOrders(prevOrders =>
                prevOrders.map(order =>
                    order.orderID === orderId ? { ...order, status: newStatus } : order
                )
            );

            // Send notification
            const notificationMessage = `ອັບເດດສະຖານະອໍເດີ ${orderId} ເປັນ ${getStatusLabel(newStatus)}`;
            await sendNotification(notificationMessage);

            message.success(notificationMessage);
        } catch (err) {
            console.error("ຜິດພາດໃນການອັບເດດສະຖານະອໍເດີ:", err);
            const errorMsg = err.response?.data?.error || err.response?.data?.message || 'ການອັບເດດສະຖານະລົ້ມເຫລວ.';
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
            render: (text) => <p className='text-center'>{text}</p> // ทำให้ text อยู่ตรงกลางเหมือน title
        },
        {
            title: 'ວັນ ແລະ ເວລາ',
            dataIndex: 'dateTime',
            key: 'dateTime',
        },
        {
            title: 'ຊື່ຜູ້ສ້າງອໍເດີ', // เปลี่ยนจาก "ผู้ขาย" เป็น "ผู้สร้างออเดอร์" หรือ "พนักงาน"
            dataIndex: 'employee',
            key: 'employee',
        },
        {
            title: 'ເບີໂທ (ຜູ້ສ້າງ)', // ระบุว่าเป็นเบอร์โทรของใคร
            dataIndex: 'phone',
            key: 'phone',
        },
        {
            title: 'ລາຄາລວມ',
            dataIndex: 'total',
            key: 'total',
            align: 'right', // ราคาควรชิดขวา
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
                        type="default" // อาจจะใช้ default หรือ primary outline
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
                // กรองเฉพาะออเดอร์ที่ยังไม่มี payment_method
                const formattedData = response.data
                    .filter(order => !order.payment_method) // เพิ่มเงื่อนไขการกรอง
                    .map(order => ({
                        key: order.id,
                        orderID: order.id,
                        dateTime: moment(order.orderDate).format('DD/MM/YYYY HH:mm'),
                        employee: order.employee ? `${order.employee.fname} ${order.employee.lname}` : 'ບໍ່ມີຂໍ້ມູນ',
                        status: order.kitchenStatus,
                        phone: order.employee ? order.employee.phone : 'ບໍ່ມີຂໍ້ມູນ',
                        total: (order.total_price || 0).toLocaleString() + ' ກີບ',
                        payment_method: order.payment_method || 'ຍັງບໍ່ທັນຊຳລະເງິນ',
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
    }, []); // Dependency array ว่างเปล่า หมายถึงจะ fetch ข้อมูลเมื่อ component mount เท่านั้น

    // Add useEffect to register service worker on component mount
    useEffect(() => {
        registerServiceWorker();
    }, []);

    // เพิ่ม useEffect เพื่อ fetch ข้อมูลใหม่เมื่อมีการเปลี่ยน user (ถ้าจำเป็น)
    // หรือถ้ามี action อื่นที่ควร trigger การ fetch ใหม่
    // useEffect(() => {
    // if (user) fetchOrders();
    // }, [user]);


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

export default TableOrder;