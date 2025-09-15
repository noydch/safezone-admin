import { message, Select } from 'antd';
import  { useEffect, useState } from 'react';
import { FaRegTrashAlt } from 'react-icons/fa';
import { HiMinus, HiPlus } from 'react-icons/hi';
import useSafezoneStore from '../../store/safezoneStore';
// ตรวจสอบให้แน่ใจว่า createOrderApi คือ API ที่จะเรียกไปยัง addOrderToTable นะครับ
import { createOrderApi } from '../../api/order';

const Cart = () => {
    const [selectedTable, setSelectedTable] = useState(null); // Can be single ID or 'group-X'
    const [isLoading, setIsLoading] = useState(false);

    // ดึงข้อมูลและ actions จาก Zustand store
    const carts = useSafezoneStore((state) => state.carts);
    const token = useSafezoneStore((state) => state.token);
    const user = useSafezoneStore((state) => state.user);
    const tables = useSafezoneStore((state) => state.tables);
    const tableGroups = useSafezoneStore((state) => state.tableGroups); // Get table groups
    const listTable = useSafezoneStore((state) => state.listTable);
    const listTableGroups = useSafezoneStore((state) => state.listTableGroups); // Get action to fetch groups
    const actionUpdateCart = useSafezoneStore((state) => state.actionUpdateCart);
    const actionRemoveFromCart = useSafezoneStore((state) => state.actionRemoveFromCart);
    const actionClearCart = useSafezoneStore((state) => state.actionClearCart);

    // โหลดรายการโต๊ะและกลุ่มโต๊ะเมื่อ component โหลด
    useEffect(() => {
        listTable();
        listTableGroups(); // Fetch table groups
    }, [listTable, listTableGroups]);

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
                actionUpdateCart(itemId, 'drink', newUnit.name, 1, unitId, newUnit.price, itemInCart.productUnits);
            } else {
                message.error("ບໍ່ພົບຫົວໜ່ວຍທີ່ເລືອກ.");
            }
        } else {
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
        if (!selectedTable) {
            message.warning('ກະລຸນາເລືອກໂຕະກ່ອນ');
            return;
        }
        if (carts.length === 0) {
            message.warning('ກະຕ່າສິນຄ້າຫວ່າງເປົ່າ');
            return;
        }
        if (!user || !user.id) {
            message.error('ບໍ່ພົບຂໍ້ມູນຜູ້ໃຊ້ງານ. ກະລຸນາລັອກອິນໃໝ່.');
            return;
        }

        setIsLoading(true);

        let tableIdsToSend = [];

        if (selectedTable.startsWith('group-')) {
            const groupId = parseInt(selectedTable.replace('group-', ''));
            const selectedGroup = tableGroups.find(group => group.id === groupId);
            if (selectedGroup) {
                tableIdsToSend = selectedGroup.tables.map(table => table.id);
            } else {
                message.error('ບໍ່ພົບກຸ່ມໂຕະທີ່ເລືອກ.');
                setIsLoading(false);
                return;
            }
        } else {
            tableIdsToSend = [parseInt(selectedTable)]; // Single table, put it in an array
        }

        if (tableIdsToSend.length === 0) {
            message.error('ບໍ່ພົບໂຕະທີ່ຈະເພີ່ມລາຍການ.');
            setIsLoading(false);
            return;
        }

        const orderData = {
            tableIds: tableIdsToSend, // Changed to tableIds (array)
            empId: parseInt(user.id),
            orderDetails: carts.map(item => {
                const detail = {
                    quantity: item.qty,
                    price: item.price,
                    itemType: item.type === 'food' ? 'FOOD' : 'DRINK'
                };

                if (item.type === 'drink') {
                    detail.productUnitId = parseInt(item.selectedUnitId);
                } else {
                    detail.foodId = parseInt(item.id);
                }

                return detail;
            })
        };

        try {
            const response = await createOrderApi(token, orderData);

            if (response && (response.status === 200 || response.status === 201)) {
                message.success('ເພີ່ມລາຍການສຳເລັດ!');
                actionClearCart();
                setSelectedTable(null);
            } else {
                const errorMessage = response?.data?.message || 'ການເພີ່ມລາຍການບໍ່ສຳເລັດ';
                message.error(errorMessage);
            }
        } catch (error) {
            const errorMessage =
                error.response?.data?.message ||
                error.message ||
                'ເກີດຂໍ້ຜິດພາດໃນການເພີ່ມລາຍການ';
            message.error(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    // ตัวเลือกสำหรับ Dropdown โต๊ะ (แสดง mergedName ถ้ามี และกรองโต๊ะที่ถูกรวม)
    const tableOptions = [
        { value: '0', label: 'ກະລຸນາເລືອກໂຕະ' },
        ...(tables?.filter(table => table.mergedName !== 'ຖືກລວມຢູ່') // Filter out tables that are part of a merged group if you want to only show the group
            .map(table => ({
                value: table.id.toString(),
                label: `ໂຕະ ${table.table_number}`, // Only show individual table number
            })) || []),
        // Add merged table groups as options
        ...(tableGroups?.map(group => ({
            value: `group-${group.id}`, // Prefix with 'group-' to distinguish
            label: `ໂຕະລວມ: ${group.tables.map(t => `ໂຕະ ${t.table_number}`).join(' + ')})`,
        })) || [])
    ];


    // แสดงชื่อโต๊ะที่เลือก (mergedName หรือ ปกติ)
    const selectedTableName = (() => {
        if (!selectedTable || selectedTable === '0') return '-';

        if (selectedTable.startsWith('group-')) {
            const groupId = parseInt(selectedTable.replace('group-', ''));
            const groupObj = tableGroups.find(g => g.id === groupId);
            return `${groupObj.tables.map(t => `ໂຕະ ${t.table_number}`).join(' + ')}`
        } else {
            const tableObj = tables.find(t => t.id === parseInt(selectedTable));
            return tableObj ? `ໂຕະ ${tableObj.table_number}` : '-';
        }
    })();

    return (
        <div className="flex-3 bg-white rounded-md py-2 px-2">
            <h1 className="text-[24px] text-center font-semibold text-gray-700">ກະຕ່າສິນຄ້າ</h1>
            <div className="mt-4">
                {/* Table Selection */}
                <div className="mb-2 flex items-center justify-center gap-x-2">
                    <p>ເລືອກໂຕະ: </p>
                    <Select
                        value={selectedTable || '0'}
                        style={{ width: 240 }}
                        className=' text-center'
                        onChange={handleChange}
                        options={tableOptions}
                        loading={!tables || !tableGroups}
                    />
                </div>

                {/* แสดงชื่อโต๊ะแทน */}
                <p className="text-center mb-4 font-semibold text-gray-600">
                    ໂຕະທີ່ເລືອກ: {selectedTableName}
                </p>

                {/* Cart Items List */}
                <ul className="flex flex-col gap-2 max-h-[calc(100vh-380px)] overflow-y-auto pr-1">
                    {carts.length === 0 ? (
                        <p className='text-center text-gray-500 my-10'>ກະຕ່າຫວ່າງເປົ່າ</p>
                    ) : (
                        carts.map((item) => (
                            <li
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
                                            <p className="font-medium">
                                                {item.type === 'drink' ? `${item?.productName} (${item.name})` : item.name}
                                            </p>
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
                                    </div>
                                </div>
                            </li>
                        ))
                    )}
                </ul>

                {/* Order Summary & Submit Button */}
                <div className="mt-5">
                    <div className="flex items-center justify-between">
                        <p className="font-semibold">ລວມທັງໝົດ</p>
                        <h4 className="text-[20px] font-bold text-green-500">
                            {getTotalPrice()} ກີບ
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
                        {isLoading ? 'ກຳລັງເພີ່ມລາຍການ...' : 'ເພີ່ມລາຍການໃສ່ໂຕະ'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Cart;
