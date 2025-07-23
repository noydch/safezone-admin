import React, { useState, useEffect } from 'react';
import { Table, Spin, Alert, Button, Tag, message, Modal, Select, Space } from 'antd'; // เพิ่ม Modal, Select
import Sidebar from '../sidebar/Sidebar';
import { useNavigate, useParams } from 'react-router-dom';
import { getOrderByIdApi, updateRoundStatusApi, checkoutOrderApi, moveOrderTableApi, cancelFoodItemOrderDetailApi } from '../../api/order'; // เพิ่ม cancelFoodItemOrderDetailApi
import { getTableApi } from '../../api/table'; // เพิ่ม import getTableApi
import useSafezoneStore from '../../store/safezoneStore';
import { IoIosArrowBack } from 'react-icons/io';
import { FaMoneyBillWave } from "react-icons/fa"; // Icon สำหรับปุ่ม Checkout
import { FaExchangeAlt } from "react-icons/fa"; // เพิ่ม Icon สำหรับปุ่มย้ายโต๊ะ
import { MdCancel } from "react-icons/md"; // เพิ่ม Icon สำหรับปุ่มยกเลิก

// ข้อมูลสถานะต่างๆ และสีที่ใช้แสดง
const ORDER_STATUSES = [
    { value: 'PENDING', label: 'ລໍຖ້າຄິວ/ລໍຖ້າຄົວ', color: 'orange' }, // Waiting Queue/Kitchen
    { value: 'COOKING', label: 'ກຳລັງປຸງແຕ່ງ', color: 'processing' }, // Cooking
    { value: 'READY', label: 'ພ້ອມເສີບ', color: 'cyan' }, // Ready to Serve
    { value: 'SERVED', label: 'ເສີບແລ້ວ', color: 'blue' }, // Served
    { value: 'PAID', label: 'ຈ່າຍເງິນແລ້ວ', color: 'success' }, // Paid
    { value: 'CANCELLED', label: 'ຍົກເລີກ', color: 'red' }, // Cancelled
    { value: 'OPEN', label: 'ເປີດຢູ່', color: 'geekblue' }, // Open (สำหรับ BillStatus)
];

const getStatusColor = (statusValue) => ORDER_STATUSES.find(s => s.value === statusValue)?.color || 'default';
const getStatusLabel = (statusValue) => ORDER_STATUSES.find(s => s.value === statusValue)?.label || statusValue;

// ตัวเลือกวิธีการชำระเงิน
const PaymentOptions = [
    { value: 'CASH', label: 'ເງິນສົດ' }, // Cash
    { value: 'TRANSFER', label: 'ເງິນໂອນ' }, // Transfer
    // { value: 'QR_CODE', label: 'QR Code' }, // ตัวอย่าง
];

const OrderDetail = () => {
    const { id: orderId } = useParams(); // เปลี่ยนชื่อ id เป็น orderId เพื่อความชัดเจน
    const token = useSafezoneStore((state) => state.token);
    const user = useSafezoneStore((state) => state.user);
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const [updatingStatus, setUpdatingStatus] = useState({}); // { roundId: boolean }

    // State สำหรับ Checkout Modal
    const [isCheckoutModalVisible, setIsCheckoutModalVisible] = useState(false);
    const [selectedPayment, setSelectedPayment] = useState(null);
    const [checkoutLoading, setCheckoutLoading] = useState(false);

    // State สำหรับ Move Table Modal (เพิ่มใหม่)
    const [isMoveTableModalVisible, setIsMoveTableModalVisible] = useState(false);
    const [selectedNewTable, setSelectedNewTable] = useState(null);
    const [availableTables, setAvailableTables] = useState([]);
    const [moveTableLoading, setMoveTableLoading] = useState(false); // สำหรับสถานะ loading ของการย้ายโต๊ะและดึงข้อมูลโต๊ะ

    const [cancellingItem, setCancellingItem] = useState({}); // { orderDetailId: boolean }

    // ฟังก์ชันสำหรับยกเลิกรายการอาหาร
    const handleCancelFoodItem = async (orderDetailId) => {
        setCancellingItem(prev => ({ ...prev, [orderDetailId]: true }));
        try {
            const response = await cancelFoodItemOrderDetailApi(token, orderDetailId);
            if (response.status === 200) {
                message.success("ຍົກເລີກລາຍການອາຫານສຳເລັດ!");
                // Re-fetch order details to update the UI with the cancelled item status
                await fetchOrderDetails();
            } else {
                message.error(response.data?.message || "ເກີດຂໍ້ຜິດພາດໃນການຍົກເລີກລາຍການອາຫານ.");
            }
        } catch (err) {
            console.error("ຜິດພາດໃນການຍົກເລີກລາຍການອາຫານ:", err);
            message.error(`ຜິດພາດ: ${err.response?.data?.message || 'ການຍົກເລີກລາຍການອາຫານລົ້ມເຫລວ'}`);
        } finally {
            setCancellingItem(prev => ({ ...prev, [orderDetailId]: false }));
        }
    };

    // Columns สำหรับตารางแสดงรายการสินค้าในแต่ละรอบ (ย้ายมาที่นี่)
    const columns = [
        {
            title: 'ລາຍການ', // Item
            dataIndex: 'item',
            key: 'item',
            render: (_, record) => {
                if (record.food) {
                    return record.food.name;
                } else if (record.productUnit) {
                    return `${record.productUnit.drink?.name || 'Unknown Drink'} (${record.productUnit.name || 'Unknown Unit'})`;
                }
                return `ໄອດີ: ${record.id}`;
            },
        },
        {
            title: 'ຈຳນວນ', // Quantity
            dataIndex: 'quantity',
            key: 'quantity',
            align: 'center',
        },
        {
            title: 'ລາຄາ', // Price
            dataIndex: 'price',
            key: 'price',
            align: 'right',
            render: (price) => `${price ? price.toLocaleString() : 0} ກີບ`, // Kip
        },
        {
            title: 'ລາຄາລວມ', // Total Price
            key: 'totalPrice',
            align: 'right',
            render: (_, record) => {
                const totalPrice = (record.quantity || 0) * (record.price || 0);
                return `${totalPrice.toLocaleString()} ກີບ`; // Kip
            }
        },
        {
            title: 'Action', // หรือ 'ການຈັດການ'
            key: 'action',
            align: 'center',
            render: (_, record) => {
                // Show button only if it's a food item, order is OPEN, and item is not already CANCELLED
                if (record.food && order?.billStatus === 'OPEN' && record.status !== 'CANCELLED') {
                    // You might also want to restrict by kitchenStatus like 'PENDING' based on your backend logic
                    // if (record.food && order?.billStatus === 'OPEN' && record.status !== 'CANCELLED' && record.kitchenStatus === 'PENDING') {
                    return (
                        <Button
                            type="primary"
                            danger // Make it red for cancellation
                            icon={<MdCancel />}
                            size="small"
                            onClick={() => handleCancelFoodItem(record.id)}
                            loading={cancellingItem[record.id]} // Use the loading state for this specific item
                        >
                            ຍົກເລີກ
                        </Button>
                    );
                }
                // If the item is already cancelled, display a tag
                if (record.status === 'CANCELLED') {
                    return <Tag color="red">ຍົກເລີກແລ້ວ</Tag>;
                }
                return null; // Don't render button for drinks or closed orders
            },
        },
    ];

    // Fetch ข้อมูล Order เมื่อ Component โหลด หรือ orderId/token เปลี่ยน
    const fetchOrderDetails = async () => {
        if (!token || !orderId) {
            setError(!orderId ? "ບໍ່ພົບ Order ID ໃນ URL." : "ຕ້ອງການ Token ໃນການເຂົ້າເຖິງຂໍ້ມູນ.");
            setLoading(false);
            return;
        }
        try {
            setLoading(true);
            setError(null);
            const response = await getOrderByIdApi(token, orderId);
            if (response && response.data) {
                setOrder(response.data);
                console.log(order);

            } else {
                setError("ບໍ່ພົບຂໍ້ມູນຄຳສັ່ງຊື້ທີ່ລະບຸ.");
            }
        } catch (err) {
            console.error("Error fetching order details:", err);
            setError(err.response?.data?.message || "ເກີດຂໍ້ຜິດພາດໃນການດຶງຂໍ້ມູນລາຍລະອຽດຄຳສັ່ງຊື້.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrderDetails();
    }, [orderId, token]);

    // จัดการการเปลี่ยนสถานะครัวของแต่ละรอบ
    const handleStatusChange = async (roundId, newStatus) => {
        setUpdatingStatus(prev => ({ ...prev, [roundId]: true }));
        try {
            await updateRoundStatusApi(token, roundId, newStatus);
            setOrder(prevOrder => ({
                ...prevOrder,
                orderRounds: prevOrder.orderRounds.map(round =>
                    round.id === roundId ? { ...round, kitchenStatus: newStatus } : round
                )
            }));
            message.success(`ອັບເດດສະຖານະຮອບ ${roundId} ເປັນ '${getStatusLabel(newStatus)}' ສຳເລັດ.`);
        } catch (err) {
            console.error("ຜິດພາດໃນການອັບເດດສະຖານະຮອບ:", err);
            message.error(`ຜິດພາດ: ${err.response?.data?.message || 'ການອັບເດດສະຖານະລົ້ມເຫລວ'}`);
        } finally {
            setUpdatingStatus(prev => ({ ...prev, [roundId]: false }));
        }
    };

    // แสดงปุ่มอัปเดตสถานะตาม Role และสถานะปัจจุบันของรอบ
    const renderStatusButton = (round) => {
        if (!user || !user.role || !order || order.billStatus !== 'OPEN') return null;

        const commonProps = {
            loading: updatingStatus[round.id],
            size: "small"
        };

        if (user.role === 'CHEF' || user.role === 'Chef') {
            if (round.kitchenStatus === 'PENDING') {
                return <Button type="primary" {...commonProps} onClick={() => handleStatusChange(round.id, 'COOKING')}>ເລີ່ມເຮັດ</Button>;
            } else if (round.kitchenStatus === 'COOKING') {
                return <Button type="primary" {...commonProps} onClick={() => handleStatusChange(round.id, 'READY')}>ພ້ອມເສີບ</Button>;
            }
        } else if (user.role === 'WAITER' || user.role === 'Waiter') {
            if (round.kitchenStatus === 'READY') {
                return <Button type="primary" style={{ backgroundColor: '#52c41a', borderColor: '#52c41a' }} {...commonProps} onClick={() => handleStatusChange(round.id, 'SERVED')}>ເສີບແລ້ວ</Button>;
            }
        }
        return null;
    };

    // ฟังก์ชันสำหรับ Checkout
    const showCheckoutModal = () => {
        setSelectedPayment(PaymentOptions[0]?.value || null); // ตั้งค่า Default ถ้ามี
        setIsCheckoutModalVisible(true);
    };

    const handleCheckoutCancel = () => {
        setIsCheckoutModalVisible(false);
    };

    const handleConfirmCheckout = async () => {
        if (!selectedPayment) {
            message.warning("ກະລຸນາເລືອກວິທີການຊຳລະເງິນ.");
            return;
        }
        if (!order || !order.id) {
            message.error("ບໍ່ພົບຂໍ້ມູນອໍເດີສຳລັບການຊຳລະເງິນ.");
            return;
        }

        setCheckoutLoading(true);
        try {
            const response = await checkoutOrderApi(token, order.id, selectedPayment);
            // ตรวจสอบว่ามี response และ message จาก backend หรือไม่
            if (response && response.data && response.data.message) {
                setIsCheckoutModalVisible(false);
                message.success(response.data.message); // แสดงข้อความสำเร็จจาก backend
                await fetchOrderDetails(); // เรียก fetchOrderDetails อีกครั้งเพื่อดึงข้อมูล Order ล่าสุด
            } else {
                // แก้ไขข้อความผิดพลาดให้เป็น "ไม่ถูกต้อง" แทน "ไม่ไม่ถูกต้อง"
                message.error("การตอบกลับจาก Server ไม่ถูกต้องหลังจากชำระเงิน.");
            }
        } catch (err) {
            console.error("ຜິດພາດໃນການຊຳລະເງິນ:", err);
            message.error(`ຜິດພາດ: ${err.response?.data?.message || 'ການຊຳລະເງິນລົ້ມເຫລວ'}`);
        } finally {
            setCheckoutLoading(false);
        }
    };

    // ฟังก์ชันสำหรับย้ายโต๊ะ (เพิ่มใหม่)
    const showMoveTableModal = async () => {
        setIsMoveTableModalVisible(true);
        setMoveTableLoading(true); // ตั้งค่า loading ขณะดึงข้อมูลโต๊ะ
        try {
            // เรียก API เพื่อดึงข้อมูลโต๊ะที่ว่าง (สถานะ AVAILABLE)
            const response = await getTableApi(token, { status: 'ວ່າງ' }); // ส่ง token และ status
            if (response && response.data) {
                // กรองไม่ให้แสดงโต๊ะปัจจุบันของ order ในรายการเลือก
                const filteredTables = response.data.filter(t => t.id !== order?.table?.id && t.status === 'ວ່າງ');
                console.log("table", response.data);

                setAvailableTables(filteredTables);
                setSelectedNewTable(null); // รีเซ็ตค่าที่เลือกไว้
            } else {
                message.error("ไม่พบข้อมูลโต๊ะที่ว่าง.");
            }
        } catch (err) {
            console.error("Error fetching available tables:", err);
            message.error(`ຜິດພາດໃນການດຶງຂໍ້ມູນໂຕະທີ່ວ່າງ: ${err.response?.data?.message || err.message}`);
        } finally {
            setMoveTableLoading(false);
        }
    };

    const handleMoveTableCancel = () => {
        setIsMoveTableModalVisible(false);
        setSelectedNewTable(null);
    };

    const handleConfirmMoveTable = async () => {
        if (!selectedNewTable) {
            message.warning("ກະລຸນາເລືອກໂຕະໃໝ່ທີ່ຈະຍ້າຍ.");
            return;
        }
        if (!order || !order.id || !order.table?.id) {
            message.error("ບໍ່ພົບຂໍ້ມູນອໍເດີ ຫຼື ໂຕະປັດຈຸບັນສຳລັບການຍ້າຍໂຕະ.");
            return;
        }

        setMoveTableLoading(true);
        try {
            // Call the actual API to move the table
            const fromTableId = order.table.id;
            const toTableId = selectedNewTable;

            const response = await moveOrderTableApi(token, fromTableId, toTableId);

            if (response && response.data) {
                setIsMoveTableModalVisible(false);
                message.success(`ຍ້າຍອໍເດີ #${order.id} ໄປໂຕະ ${availableTables.find(t => t.id === selectedNewTable)?.table_number} ສຳເລັດ!`);
                // Re-fetch order details to reflect the new table number in the UI
                await fetchOrderDetails();
            } else {
                message.error("ການຕອບກັບຈາກ Server ບໍ່ຖືກຕ້ອງຫຼັງຈາກຍ້າຍໂຕະ.");
            }

        } catch (err) {
            console.error("ຜິດພາດໃນການຍ້າຍໂຕະ:", err);
            message.error(`ຜິດພາດ: ${err.response?.data?.message || 'ການຍ້າຍໂຕະລົ້ມເຫລວ'}`);
        } finally {
            setMoveTableLoading(false);
        }
    };

    // แสดงผลรายละเอียด Order ทั้งหมด
    const renderOrderDetailsContent = () => {
        if (!order) return <Alert message="ບໍ່ພົບຂໍ້ມູນຄຳສັ່ງຊື້." type="warning" showIcon />;

        return (
            <div className="space-y-6">
                <div className="bg-white p-6 rounded-xl shadow-lg">
                    <div className='flex justify-between items-start mb-4'>
                        <div>
                            <h3 className="text-xl font-semibold text-gray-800">ຂໍ້ມູນຄຳສັ່ງຊື້ #{order.id}</h3>
                            <p className="text-gray-600">ພະນັກງານ: {order.employee?.fname} {order.employee?.lname}</p>
                            <p className="text-gray-600">
                                ໂຕະ: {order?.mergedFromIds == null ? order?.table?.table_number :
                                    order?.mergedFromIds
                                }
                            </p>
                            <p className="text-gray-600">
                                ສະຖານະບິນ: <Tag color={getStatusColor(order.billStatus)}>{getStatusLabel(order.billStatus)}</Tag>
                            </p>
                            {order.payment_method && (
                                <p className="text-gray-600">
                                    ວິທີຊຳລະ: <Tag color={getStatusColor(order.payment_method)}>{getStatusLabel(order.payment_method)}</Tag>
                                </p>
                            )}
                            <p className='text-2xl font-bold text-green-600 mt-2'>ລາຄາລວມ: {order.total_price?.toLocaleString()} ກີບ</p>
                        </div>
                        <div className="flex space-x-2"> {/* ใช้ flexbox จัดเรียงปุ่ม */}
                            {order.billStatus === 'OPEN' && (user?.role === 'Cashier' || user?.role === 'Manager' || user?.role === 'Owner') && (
                                <Button
                                    type="primary"
                                    icon={<FaMoneyBillWave className="mr-2" />}
                                    size="large"
                                    style={{ backgroundColor: '#10B981', borderColor: '#10B981' }}
                                    className="hover:bg-green-700"
                                    onClick={showCheckoutModal}
                                    loading={checkoutLoading}
                                >
                                    ຊຳລະເງິນ (Checkout)
                                </Button>
                            )}
                            {/* แก้ไขเงื่อนไขการแสดงปุ่มย้ายโต๊ะ: แสดงเมื่อ Order เป็น OPEN และ Role ไม่ใช่ Chef */}
                            {order.billStatus === 'OPEN' && user?.role?.toLowerCase() !== 'chef' && (
                                <Button
                                    type="default" // สามารถเปลี่ยนเป็น "primary" ได้ตามต้องการ
                                    icon={<FaExchangeAlt className="mr-2" />}
                                    size="large"
                                    onClick={showMoveTableModal}
                                    loading={moveTableLoading}
                                >
                                    ຍ້າຍໂຕະ
                                </Button>
                            )}
                        </div>
                    </div>
                </div>

                {order.orderRounds?.length > 0 ? (
                    order.orderRounds.map((round) => (
                        <div key={round.id} className="bg-white p-6 rounded-xl shadow-lg">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-lg font-semibold text-gray-700">
                                    ຮອບທີ {round.roundNumber}
                                    <span className="text-sm text-gray-500 ml-2">
                                        ({new Date(round.createdAt).toLocaleTimeString('lo-LA', { hour: '2-digit', minute: '2-digit' })})
                                    </span>
                                </h3>
                                <Space>
                                    <Tag color={getStatusColor(round.kitchenStatus)}>
                                        {getStatusLabel(round.kitchenStatus)}
                                    </Tag>
                                    {renderStatusButton(round)}
                                </Space>
                            </div>
                            <Table
                                columns={columns}
                                dataSource={round.orderDetails}
                                rowKey={(record, index) => `detail-${round.id}-${record.id || index}-${record.foodId || record.drinkId}`}
                                bordered
                                pagination={false}
                                size="small"
                            />
                        </div>
                    ))
                ) : (
                    <Alert message="ບໍ່ມີລາຍການໃນອໍເດີນີ້." type="info" showIcon className="mt-4" />
                )}
            </div>
        );
    };

    return (
        <Sidebar>
            <Button
                type="text"
                icon={<IoIosArrowBack />}
                onClick={() => navigate(-1)}
                className='mb-4 px-0 text-gray-700 hover:text-blue-600'
            >
                ກັບຄືນ
            </Button>
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">ລາຍລະອຽດຄຳສັ່ງຊື້ #{orderId}</h2>
            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <Spin size="large" tip="ກຳລັງໂຫລດ..." />
                </div>
            ) : error ? (
                <Alert message="ເກີດຂໍ້ຜິດພາດ" description={error} type="error" showIcon />
            ) : (
                renderOrderDetailsContent()
            )}

            <Modal
                title={`ຊຳລະເງິນສຳລັບອໍເດີ #${order?.id} (ໂຕະ ${order?.table?.table_number})`}
                visible={isCheckoutModalVisible}
                onOk={handleConfirmCheckout}
                onCancel={handleCheckoutCancel}
                confirmLoading={checkoutLoading}
                okText="ຢືນຢັນການຊຳລະ"
                cancelText="ຍົກເລີກ"
                centered
            >
                <p className="mb-2">ກະລຸນາເລືອກວິທີການຊຳລະເງິນ:</p>
                <Select
                    placeholder="ເລືອກວິທີຊຳລະ"
                    style={{ width: '100%', marginBottom: 16 }}
                    onChange={(value) => setSelectedPayment(value)}
                    value={selectedPayment}
                    options={PaymentOptions}
                />
                <p className='mt-4 text-lg font-semibold'>ຍອດທີ່ຕ້ອງຊຳລະ: <strong className="text-green-600">{order?.total_price?.toLocaleString()} ກີບ</strong></p>
            </Modal>

            {/* Modal สำหรับย้ายโต๊ะ (เพิ่มใหม่) */}
            <Modal
                title={`ຍ້າຍອໍເດີ #${order?.id} ໄປໂຕະໃໝ່`}
                visible={isMoveTableModalVisible}
                onOk={handleConfirmMoveTable}
                onCancel={handleMoveTableCancel}
                confirmLoading={moveTableLoading}
                okText="ຢືນຢັນການຍ້າຍ"
                cancelText="ຍົກເລີກ"
                centered
            >
                <p className="mb-2">ເລືອກໂຕະໃໝ່:</p>
                <Select
                    placeholder="ເລືອກໂຕະ"
                    style={{ width: '100%', marginBottom: 16 }}
                    onChange={(value) => setSelectedNewTable(value)}
                    value={selectedNewTable}
                    options={availableTables.map(table => ({
                        value: table.id,
                        label: `ໂຕະ ${table.table_number}`
                    }))}
                    loading={moveTableLoading}
                    disabled={moveTableLoading} // ปิดใช้งาน Select ขณะโหลด
                />
                {order && <p className='mt-4 text-lg font-semibold'>
                    ໂຕະປັດຈຸບັນ: <strong className="text-blue-600">ໂຕະ {order.table?.table_number}</strong>
                </p>}
            </Modal>
        </Sidebar>
    );
}

export default OrderDetail;