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
    console.log(carts);

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
        console.log('[Cart.jsx] Current Carts (after render):', carts); // Debug log
    }, [listTable, carts]); // Re-log เมื่อ carts เปลี่ยนแปลง

    // จัดการการเลือกโต๊ะ
    const handleChange = (value) => {
        setSelectedTable(value === '0' ? null : value);
    };

    // handleUnitChange จะถูกเรียกเมื่อผู้ใช้เปลี่ยน dropdown สำหรับเครื่องดื่ม
    const handleUnitChange = (itemId, unitId) => {
        const itemInCart = carts.find(cartItem => cartItem.id === itemId && cartItem.type === 'drink');

        if (itemInCart && itemInCart.productUnits) {
            const newUnit = itemInCart.productUnits.find(u => u.id === unitId);
            if (newUnit) {
                // เมื่อเปลี่ยนหน่วย ให้ส่งข้อมูล productUnits ทั้งหมดของ item นี้ไปด้วย
                actionUpdateCart(itemId, 'drink', newUnit.name, 1, unitId, newUnit.price, itemInCart.productUnits);
            } else {
                console.warn(`[Cart.jsx] Unit with ID ${unitId} not found in productUnits for item ${itemId}.`);
                message.error("ບໍ່ພົບຫົວໜ່ວຍທີ່ເລືອກ.");
            }
        } else {
            console.error(`[Cart.jsx] Item ${itemId} or its productUnits not found in cart for unit change.`);
            message.error("ຂໍ້ມູນສິນຄ້າບໍ່ຄົບຖ້ວນ.");
        }
    };

    // handleUpdateCart สำหรับเพิ่ม/ลดจำนวน
    const handleUpdateCart = (itemId, type, name, qty) => {
        if (qty <= 0) return;

        const itemInCart = carts.find(cartItem => cartItem.id === itemId && cartItem.type === type);

        if (!itemInCart) {
            message.error("ບໍ່ພົບສິນຄ້າໃນກະຕ່າເພື່ອອັບເດດ.");
            return;
        }

        if (type === 'drink') {
            if (!itemInCart.selectedUnitId) {
                message.warning('ກະລຸນາເລືອກຫົວໜ່ວຍກ່ອນ');
                return;
            }
            // ส่ง productUnits ที่มีอยู่ใน item ไปด้วย
            actionUpdateCart(itemId, type, itemInCart.name, qty, itemInCart.selectedUnitId, itemInCart.price, itemInCart.productUnits);
        } else {
            actionUpdateCart(itemId, type, name, qty);
        }
    };

    const handleRemoveItem = (itemId, type, selectedUnitId) => {
        actionRemoveFromCart(itemId, type, selectedUnitId);
    };

    const calculateRawTotalPrice = () => {
        return carts.reduce((total, item) => total + (item.qty * item.price), 0);
    };

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

        // --- เตรียมข้อมูลที่จะส่ง (ปรับโครงสร้างให้ตรงกับ Backend) ---
        const orderData = {
            tableId: parseInt(selectedTable),
            empId: parseInt(user.id),
            orderDetails: carts.map(item => {
                const detail = {
                    quantity: item.qty,
                    price: item.price
                };

                // แยกประเภทสินค้า (อาหาร/เครื่องดื่ม)
                if (item.type === 'drink') {
                    detail.productUnitId = parseInt(item.selectedUnitId);
                } else {
                    detail.foodId = parseInt(item.id);
                }

                return detail;
            })
        };

        console.log("Sending order data to backend:", orderData);

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
        { value: '0', label: 'ກະລຸນາເລືອກໂຕະ' },
        ...(tables?.map((table) => ({
            value: table.id.toString(),
            label: `ໂຕະ ${table.table_number}`,
        })) || []),
    ];

    // --- ส่วนแสดงผล (JSX) ---
    return (
        <div className="flex-3 bg-white rounded-md py-2 px-2">
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
                                // *** สำคัญ: เปลี่ยน key ให้ unique สำหรับแต่ละหน่วยขาย ***
                                key={`${item.type}-${item.id}-${item.selectedUnitId || 'no-unit'}`}
                                className="w-full h-[100px] relative flex border border-gray-300 rounded p-1"
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
                                        <div>
                                            <p className="font-medium">{item?.productUnits[0]?.drink.name} ({item.name}) </p>
                                        </div>
                                        <div className=''>
                                            {item.type === 'drink' && (
                                                <Select
                                                    value={item.selectedUnitId}
                                                    style={{ width: 200, marginBottom: 4, fontSize: 10 }}
                                                    onChange={(value) => handleUnitChange(item.id, value)}
                                                    options={item.productUnits?.map(unit => ({
                                                        value: unit.id,
                                                        label: `${unit.name} (${unit.price.toLocaleString()} ກີບ)`
                                                    })) || []}
                                                    placeholder="ເລືອກຫົວໜ່ວຍ"
                                                    disabled={!item.productUnits || item.productUnits.length === 0}
                                                />
                                            )}
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
                                    </div>
                                    {/* Price & Remove */}
                                    <div className="flex flex-col items-end justify-between pr-1">
                                        <button
                                            onClick={() => handleRemoveItem(item.id, item.type, item.selectedUnitId)}
                                            className="text-red-700 cursor-pointer hover:text-red-500"
                                            aria-label="Remove item"
                                        >
                                            <FaRegTrashAlt />
                                        </button>
                                        {/* <p className="font-semibold">
                                            {item.type === 'drink' && item.selectedUnitId && item.productUnits?.length > 0
                                                ? `${item.productUnits.find(unit => unit.id === item.selectedUnitId)?.price.toLocaleString() || '0'} ກີບ (x${item.qty})`
                                                : `${(itemใproductUnits[0].price * item.qty).toLocaleString()} ກີບ`}
                                        </p> */}
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