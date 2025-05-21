import React, { useState, useEffect } from 'react';
import { Button, Space, Table, Tag, Spin, Alert, message } from 'antd';
import axios from 'axios'; // ยังคงใช้ axios สำหรับ fetchOrders
import ApiPath from '../../api/apiPath';
import moment from 'moment';
import { updateOrderApi } from '../../api/order'; // API function สำหรับอัปเดต
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

const TableOrder = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [updatingStatus, setUpdatingStatus] = useState({});
    const navigate = useNavigate();
    const user = useSafezoneStore((state) => state.user);
    const token = useSafezoneStore((state) => state.token); // Move this to component level

    // Function to handle the API call and state update
    const handleStatusChange = async (orderId, newStatus) => {
        setUpdatingStatus(prev => ({ ...prev, [orderId]: true }));

        try {
            // Use token from component level instead of calling hook inside function
            await updateOrderApi(token, orderId, newStatus);

            setOrders(prevOrders =>
                prevOrders.map(order =>
                    order.orderID === orderId ? { ...order, status: newStatus } : order
                )
            );
            message.success(`ອັບເດດສະຖານະອໍເດີ ${orderId} ເປັນ ${getStatusLabel(newStatus)} ສຳເລັດ`);
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
            title: 'ສະຖານະ',
            key: 'status',
            dataIndex: 'status',
            render: (status, record) => {
                const currentStatusLabel = getStatusLabel(status);
                let actionButton = null;

                // Logic for Chef
                if (user?.role === 'CHEF' || user?.role === 'Chef') {
                    if (status === 'PENDING') {
                        actionButton = (
                            <Button
                                type="primary"
                                loading={updatingStatus[record.orderID]}
                                onClick={() => handleStatusChange(record.orderID, 'COOKING')}
                            >
                                ເລີ່ມເຮັດ (Cooking)
                            </Button>
                        );
                    } else if (status === 'COOKING') {
                        actionButton = (
                            <Button
                                type="primary"
                                loading={updatingStatus[record.orderID]}
                                onClick={() => handleStatusChange(record.orderID, 'READY')}
                            >
                                ພ້ອມເສີບ (Ready)
                            </Button>
                        );
                    }
                }
                // Logic for Waiter
                else if (user?.role === 'WAITER' || user?.role === 'Waiter') {
                    if (status === 'READY') {
                        actionButton = (
                            <Button
                                type="primary"
                                style={{ backgroundColor: '#52c41a', borderColor: '#52c41a' }}
                                loading={updatingStatus[record.orderID]}
                                onClick={() => handleStatusChange(record.orderID, 'SERVED')}
                            >
                                ເສີບແລ້ວ (Served)
                            </Button>
                        );
                    }
                }
                // Logic for Cashier
                else if (user?.role === 'CASHIER' || user?.role === 'Cashier') {
                    if (status === 'SERVED') {
                        actionButton = (
                            <Button
                                type="primary"
                                style={{ backgroundColor: '#1890ff', borderColor: '#1890ff' }}
                                loading={updatingStatus[record.orderID]}
                                onClick={() => handleStatusChange(record.orderID, 'PAID')}
                            >
                                ຈ່າຍແລ້ວ (Paid)
                            </Button>
                        );
                    }
                }

                return (
                    <Space>
                        <Tag color={getStatusColor(status)}>
                            {currentStatusLabel}
                        </Tag>
                        {actionButton}
                    </Space>
                );
            },
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
                // สมมติว่า ApiPath.getOrders ถูกต้อง และ axios instance มีการตั้งค่า auth header แล้ว
                const response = await axios.get(ApiPath.getOrders);
                const formattedData = response.data.map(order => ({
                    key: order.id,
                    orderID: order.id, // ส่งเป็นตัวเลขหรือ string ก็ได้ แล้ว render function จัดการ
                    dateTime: moment(order.orderDate).format('DD/MM/YYYY HH:mm'),
                    employee: order.employee ? `${order.employee.fname} ${order.employee.lname}` : 'ບໍ່ມີຂໍ້ມູນ',
                    status: order.status,
                    phone: order.employee ? order.employee.phone : 'ບໍ່ມີຂໍ້ມູນ',
                    total: (order.total_price || 0).toLocaleString() + ' ກີບ',
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