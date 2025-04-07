import { message, Select } from 'antd';
import React, { useEffect, useState } from 'react';
import { FaRegTrashAlt } from 'react-icons/fa';
import { HiMinus, HiPlus } from 'react-icons/hi';
import useSafezoneStore from '../../store/safezoneStore';
import { createOrderApi } from '../../api/order';

const Cart = () => {
    const [selectedTable, setSelectedTable] = useState(null);
    const [selectedPayment, setSelectedPayment] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const carts = useSafezoneStore((state) => state.carts);
    const token = useSafezoneStore((state) => state.token);
    const user = useSafezoneStore((state) => state.user);
    const tables = useSafezoneStore((state) => state.tables);
    const listTable = useSafezoneStore((state) => state.listTable);
    const actionUpdateCart = useSafezoneStore((state) => state.actionUpdateCart);
    const actionRemoveFromCart = useSafezoneStore((state) => state.actionRemoveFromCart);
    const actionClearCart = useSafezoneStore((state) => state.actionClearCart);

    useEffect(() => {
        listTable();
    }, [listTable]);

    const handleChange = (value) => {
        if (value === '0') {
            setSelectedTable(null);
            return;
        }
        setSelectedTable(value);
        console.log('Selected Table:', value);
    };
    const handleChangePayment = (value) => {
        if (value === '0') {
            setSelectedPayment(null);
            return;
        }
        setSelectedPayment(value);
        console.log('Selected Payment:', value);
    };

    const handleUpdateCart = (itemId, type, name, qty) => {
        if (qty <= 0) return;
        actionUpdateCart(itemId, type, name, qty);
    };

    const handleRemoveItem = (itemId, type, name) => {
        actionRemoveFromCart(itemId, type, name);
    };

    const calculateRawTotalPrice = () => {
        return carts.reduce((total, item) => {
            return total + (item.qty * item.price);
        }, 0);
    };

    const getTotalPrice = () => {
        return calculateRawTotalPrice().toLocaleString();
    };

    const handleCreateOrder = async () => {
        if (!selectedTable) {
            message.warning('ກະລຸນາເລືອກໂຕະກ່ອນ');
            return;
        }
        if (!selectedPayment) {
            message.warning('ກະລຸນາເລືອກວິທີການຊຳລະເງິນກ່ອນ');
            return;
        }
        if (carts.length === 0) {
            message.warning('ກະຕ່າສິນຄ້າຫວ່າງເປົ່າ');
            return;
        }

        if (!user || !user.id) {
            message.error('ບໍ່ພົບຂໍ້ມູນຜູ້ໃຊ້ງານ. ກະລຸນາລັອກອິນໃໝ່.');
            setIsLoading(false);
            return;
        }

        setIsLoading(true);

        const orderData = {
            paymentMethod: selectedPayment.toUpperCase(),
            empId: user.id,
            orderDetails: carts.map(item => ({
                itemId: item.id,
                itemType: item.type,
                quantity: item.qty,
                price: item.price
            }))
        };

        console.log("Sending order data to backend:", orderData);

        try {
            const response = await createOrderApi(token, orderData);
            console.log("Order creation response:", response);
            if (response && (response.status === 200 || response.status === 201)) {
                message.success('ສ້າງລາຍການສຳເລັດ!');
                actionClearCart();
                setSelectedTable(null);
                setSelectedPayment(null);
            }
        } catch (error) {
            console.error("Error creating order:", error.response || error);
            // const errorMessage = error.response?.data?.message || 'ເກີດຂໍ້ຜິດພາດໃນການສ້າງລາຍການ';
            message.error(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    const tableOptions = [
        { value: '0', label: 'ກະລຸນາເລືອກໂຕະ' },
        ...(tables?.map((table) => ({
            value: table.id.toString(),
            label: `ໂຕະ ${table.table_number}`,
        })) || []),
    ];

    const paymentOption = [
        {
            value: '0',
            label: 'ເລືອກການຊຳລະ'
        },
        {
            value: 'cash',
            label: 'ເງິນສົດ'
        },
        {
            value: 'transfer',
            label: 'ເງິນໂອນ'
        }
    ];

    return (
        <div className="flex-1 bg-white rounded-md py-2 px-2">
            <h1 className="text-[24px] text-center font-semibold text-gray-700">ກະຕ່າສິນຄ້າ</h1>
            <div className="mt-4">
                <div className="mb-2 flex items-center justify-center gap-x-2">
                    <p>ເລືອກໂຕະ: </p>
                    <Select
                        value={selectedTable || '0'}
                        style={{
                            width: 140,
                        }}
                        className=' text-center'
                        onChange={handleChange}
                        options={tableOptions}
                        loading={!tables}
                    />
                </div>

                <ul className="flex flex-col gap-2 max-h-[calc(100vh-450px)] overflow-y-auto pr-1">
                    {carts.length === 0 ? (
                        <p className='text-center text-gray-500 my-10'>ກະຕ່າຫວ່າງເປົ່າ</p>
                    ) : (
                        carts.map((item) => (
                            <li
                                key={`${item.type}-${item.id}-${item.name}`}
                                className="w-full h-[80px] relative flex border border-gray-300 rounded p-1"
                            >
                                <div className='w-[90px] h-full rounded border border-gray-200'>
                                    <img
                                        src={item.imageUrl || '/placeholder.png'}
                                        alt={item.name}
                                        className="w-full h-full object-cover rounded"
                                        onError={(e) => { e.target.onerror = null; e.target.src = '/placeholder.png' }}
                                    />
                                </div>
                                <div className="flex justify-between w-full ml-1.5 py-1">
                                    <div className="flex flex-col justify-between h-full">
                                        <p className="font-medium">{item.name}</p>
                                        <div className="flex items-center w-[80px] justify-between border rounded border-gray-200">
                                            <div
                                                onClick={() => handleUpdateCart(item.id, item.type, item.name, item.qty - 1)}
                                                className="cursor-pointer bg-gray-200 w-[24px] h-[24px] rounded flex items-center justify-center"
                                            >
                                                <HiMinus className="text-[14px]" />
                                            </div>
                                            <span className="text-[14px] font-medium">{item.qty}</span>
                                            <div
                                                onClick={() => handleUpdateCart(item.id, item.type, item.name, item.qty + 1)}
                                                className="cursor-pointer bg-gray-200 w-[24px] h-[24px] rounded flex items-center justify-center"
                                            >
                                                <HiPlus className="text-[14px]" />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-end justify-between pr-1">
                                        <FaRegTrashAlt
                                            className="text-red-700 cursor-pointer"
                                            onClick={() => handleRemoveItem(item.id, item.type, item.name)}
                                        />
                                        <p className="font-semibold">
                                            {(item.price * item.qty).toLocaleString()} ກີບ
                                        </p>
                                    </div>
                                </div>
                            </li>
                        ))
                    )}
                </ul>

                <div className="my-4 flex items-center justify-center w-full gap-x-2">
                    <p>ວິທີຊຳລະ: </p>
                    <Select
                        value={selectedPayment || '0'}
                        style={{
                            flex: 1
                        }}
                        className=' text-center'
                        onChange={handleChangePayment}
                        options={paymentOption}
                    />
                </div>

                <div className="mt-5">
                    <div className="flex items-center justify-between">
                        <p className="font-semibold">ລວມທັງໝົດ</p>
                        <h4 className="text-[20px] font-bold text-green-500">
                            {getTotalPrice()} ກີບ
                        </h4>
                    </div>
                    <button
                        onClick={handleCreateOrder}
                        disabled={isLoading || carts.length === 0}
                        className={`w-full text-center bg-green-500 py-2 rounded-md text-white font-semibold hover:bg-green-400 cursor-pointer mt-2 ${isLoading || carts.length === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        {isLoading ? 'ກຳລັງດຳເນີນການ...' : 'ດຳເນີນການຕໍ່'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Cart;
