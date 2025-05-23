import { message, Select } from 'antd';
import React, { useEffect, useState } from 'react';
import { FaRegTrashAlt } from 'react-icons/fa';
import { HiMinus, HiPlus } from 'react-icons/hi';
import useSafezoneStore from '../../store/safezoneStore';
// ตรวจสอบให้แน่ใจว่า createOrderApi คือ API ที่จะเรียกไปยัง addOrderToTable นะครับ
import { createOrderApi } from '../../api/order';

const Cart = () => {
    const [selectedTable, setSelectedTable] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    // ดึงข้อมูลและ actions จาก Zustand store
    const carts = useSafezoneStore((state) => state.carts);
    const token = useSafezoneStore((state) => state.token);
    const user = useSafezoneStore((state) => state.user);
    const tables = useSafezoneStore((state) => state.tables);
    const listTable = useSafezoneStore((state) => state.listTable);
    const actionUpdateCart = useSafezoneStore((state) => state.actionUpdateCart);
    const actionRemoveFromCart = useSafezoneStore((state) => state.actionRemoveFromCart);
    const actionClearCart = useSafezoneStore((state) => state.actionClearCart);

    // โหลดรายการโต๊ะเมื่อ component โหลด
    useEffect(() => {
        listTable();
    }, [listTable]);

    // จัดการการเลือกโต๊ะ
    const handleChange = (value) => {
        setSelectedTable(value === '0' ? null : value);
        console.log('Selected Table:', value === '0' ? null : value);
    };

    // จัดการการอัปเดตจำนวนสินค้า
    const handleUpdateCart = (itemId, type, name, qty) => {
        if (qty <= 0) return; // ไม่ให้น้อยกว่า 1
        actionUpdateCart(itemId, type, name, qty);
    };

    // จัดการการลบสินค้า
    const handleRemoveItem = (itemId, type, name) => {
        actionRemoveFromCart(itemId, type, name);
    };

    // คำนวณราคารวม
    const calculateRawTotalPrice = () => {
        return carts.reduce((total, item) => total + (item.qty * item.price), 0);
    };

    // จัดรูปแบบราคารวม
    const getTotalPrice = () => {
        return calculateRawTotalPrice().toLocaleString();
    };

    // จัดการการเพิ่มรายการไปยังโต๊ะ (ส่ง Order ไป Backend)
    const handleCreateOrder = async () => {
        // --- ตรวจสอบ ---
        if (!selectedTable) {
            message.warning('ກະລຸນາເລືອກໂຕະກ່ອນ'); // Please select a table first
            return;
        }
        if (carts.length === 0) {
            message.warning('ກະຕ່າສິນຄ້າຫວ່າງເປົ່າ'); // Cart is empty
            return;
        }
        if (!user || !user.id) {
            message.error('ບໍ່ພົບຂໍ້ມູນຜູ້ໃຊ້ງານ. ກະລຸນາລັອກອິນໃໝ່.'); // User data not found.
            return;
        }

        setIsLoading(true);

        // --- เตรียมข้อมูลที่จะส่ง (ไม่มี paymentMethod) ---
        const orderData = {
            tableId: selectedTable,
            empId: user.id,
            orderDetails: carts.map(item => ({
                itemId: item.id,
                itemType: item.type,
                quantity: item.qty,
                price: item.price
            }))
        };

        console.log("Sending order data to backend (Add to Table):", orderData);

        try {
            const response = await createOrderApi(token, orderData);
            console.log("Order creation response:", response);

            if (response && (response.status === 200 || response.status === 201)) {
                message.success('ເພີ່ມລາຍການສຳເລັດ!'); // Items added successfully!
                actionClearCart();
                setSelectedTable(null);
            } else {
                const errorMessage = response?.data?.message || 'ການເພີ່ມລາຍການບໍ່ສຳເລັດ'; // Adding items failed
                message.error(errorMessage);
            }
        } catch (error) {
            console.error("Error adding items to order:", error.response || error);
            const errorMessage =
                error.response?.data?.message ||
                error.message ||
                'ເກີດຂໍ້ຜິດພາດໃນການເພີ່ມລາຍການ'; // An error occurred while adding items
            message.error(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    // ตัวเลือกสำหรับ Dropdown โต๊ะ
    const tableOptions = [
        { value: '0', label: 'ກະລຸນາເລືອກໂຕະ' }, // Please select a table
        ...(tables?.map((table) => ({
            value: table.id.toString(),
            label: `ໂຕະ ${table.table_number}`, // Table [number]
        })) || []),
    ];

    // --- ส่วนแสดงผล (JSX) ---
    return (
        <div className="flex-1 bg-white rounded-md py-2 px-2">
            <h1 className="text-[24px] text-center font-semibold text-gray-700">ກະຕ່າສິນຄ້າ</h1> {/* Shopping Cart */}
            <div className="mt-4">
                {/* Table Selection */}
                <div className="mb-2 flex items-center justify-center gap-x-2">
                    <p>ເລືອກໂຕະ: </p> {/* Select Table: */}
                    <Select
                        value={selectedTable || '0'}
                        style={{ width: 140 }}
                        className=' text-center'
                        onChange={handleChange}
                        options={tableOptions}
                        loading={!tables}
                    />
                </div>

                {/* Cart Items List */}
                <ul className="flex flex-col gap-2 max-h-[calc(100vh-380px)] overflow-y-auto pr-1">
                    {carts.length === 0 ? (
                        <p className='text-center text-gray-500 my-10'>ກະຕ່າຫວ່າງເປົ່າ</p> /* Cart is empty */
                    ) : (
                        carts.map((item) => (
                            <li
                                key={`${item.type}-${item.id}-${item.name}`}
                                className="w-full h-[80px] relative flex border border-gray-300 rounded p-1"
                            >
                                {/* Image */}
                                <div className='w-[90px] h-full rounded border border-gray-200'>
                                    <img
                                        src={item.imageUrl || '/placeholder.png'}
                                        alt={item.name}
                                        className="w-full h-full object-cover rounded"
                                        onError={(e) => { e.target.onerror = null; e.target.src = '/placeholder.png' }}
                                    />
                                </div>
                                {/* Details & Controls */}
                                <div className="flex justify-between w-full ml-1.5 py-1">
                                    <div className="flex flex-col justify-between h-full">
                                        <p className="font-medium">{item.name}</p>
                                        {/* Quantity Controls */}
                                        <div className="flex items-center w-[80px] justify-between border rounded border-gray-200">
                                            <button
                                                onClick={() => handleUpdateCart(item.id, item.type, item.name, item.qty - 1)}
                                                className="cursor-pointer bg-gray-200 w-[24px] h-[24px] rounded flex items-center justify-center hover:bg-gray-300"
                                                aria-label="Decrease quantity"
                                            >
                                                <HiMinus className="text-[14px]" />
                                            </button>
                                            <span className="text-[14px] font-medium">{item.qty}</span>
                                            <button
                                                onClick={() => handleUpdateCart(item.id, item.type, item.name, item.qty + 1)}
                                                className="cursor-pointer bg-gray-200 w-[24px] h-[24px] rounded flex items-center justify-center hover:bg-gray-300"
                                                aria-label="Increase quantity"
                                            >
                                                <HiPlus className="text-[14px]" />
                                            </button>
                                        </div>
                                    </div>
                                    {/* Price & Remove */}
                                    <div className="flex flex-col items-end justify-between pr-1">
                                        <button
                                            onClick={() => handleRemoveItem(item.id, item.type, item.name)}
                                            className="text-red-700 cursor-pointer hover:text-red-500"
                                            aria-label="Remove item"
                                        >
                                            <FaRegTrashAlt />
                                        </button>
                                        <p className="font-semibold">
                                            {(item.price * item.qty).toLocaleString()} ກີບ {/* Kip */}
                                        </p>
                                    </div>
                                </div>
                            </li>
                        ))
                    )}
                </ul>

                {/* Order Summary & Submit Button */}
                <div className="mt-5">
                    <div className="flex items-center justify-between">
                        <p className="font-semibold">ລວມທັງໝົດ</p> {/* Total */}
                        <h4 className="text-[20px] font-bold text-green-500">
                            {getTotalPrice()} ກີບ {/* Kip */}
                        </h4>
                    </div>
                    <button
                        onClick={handleCreateOrder}
                        disabled={isLoading || carts.length === 0 || !selectedTable}
                        className={`w-full text-center bg-green-500 py-2 rounded-md text-white font-semibold hover:bg-green-400 cursor-pointer mt-2 
                                    ${isLoading || carts.length === 0 || !selectedTable
                                ? 'opacity-50 cursor-not-allowed'
                                : ''}`}
                    >
                        {isLoading ? 'ກຳລັງເພີ່ມລາຍການ...' : 'ເພີ່ມລາຍການໃສ່ໂຕະ'} {/* Adding Items... : Add Items to Table */}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Cart;