import { message, Select } from 'antd';
import React, { useEffect, useState } from 'react';
import { FaRegTrashAlt } from 'react-icons/fa';
import { HiMinus, HiPlus } from 'react-icons/hi';
import useSafezoneStore from '../../store/safezoneStore';

const Cart = () => {
    const [selectedTable, setSelectedTable] = useState(null);
    const carts = useSafezoneStore((state) => state.carts);
    const token = useSafezoneStore((state) => state.token);
    const tables = useSafezoneStore((state) => state.tables);
    const listTable = useSafezoneStore((state) => state.listTable);
    const actionUpdateCart = useSafezoneStore((state) => state.actionUpdateCart);
    const actionRemoveFromCart = useSafezoneStore((state) => state.actionRemoveFromCart);

    useEffect(() => {
        listTable();
    }, [listTable]);

    const handleChange = (value) => {
        setSelectedTable(value);
        console.log(value);
    };

    const handleUpdateCart = (itemId, type, name, qty) => {
        if (qty <= 0) return;
        actionUpdateCart(itemId, type, name, qty);
    };

    const handleRemoveItem = (itemId, type, name) => {
        actionRemoveFromCart(itemId, type, name);
    };

    const getTotalPrice = () => {
        return carts.reduce((total, item) => {
            return total + (item.qty * item.price);
        }, 0).toLocaleString();
    };

    const tableOptions = [
        { value: '0', label: 'ກະລຸນາເລືອກໂຕະ' },
        ...(tables?.map((table) => ({
            value: table.id.toString(),
            label: `ໂຕະ ${table.table_number}`,
        })) || []),
    ];

    return (
        <div className="flex-1 bg-white rounded-md py-2 px-2">
            <h1 className="text-[24px] text-center font-semibold text-gray-700">ກະຕ່າສິນຄ້າ</h1>
            <div className="mt-4">
                <div className="mb-2 flex items-center justify-center gap-x-2">
                    <p>ເລືອກໂຕະ: </p>
                    <Select
                        defaultValue={'0'}
                        style={{
                            width: 140,
                        }}
                        className=' text-center'
                        onChange={handleChange}
                        options={tableOptions}
                        loading={!tables}
                    />
                </div>

                <ul className="flex flex-col gap-2">
                    {carts.map((item) => (
                        <li
                            key={`${item.type}-${item.id}-${item.name}`}
                            className="w-full h-[80px] relative flex border border-gray-300 rounded p-1"
                        >
                            <img
                                src={item.imageUrl}
                                alt=""
                                className="w-[70px] h-full object-cover rounded"
                            />
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
                    ))}
                </ul>

                <div className="mt-5">
                    <div className="flex items-center justify-between">
                        <p className="font-semibold">ລວມທັງໝົດ</p>
                        <h4 className="text-[20px] font-bold text-green-500">
                            {getTotalPrice()} ກີບ
                        </h4>
                    </div>
                    <button
                        className="w-full text-center bg-green-500 py-2 rounded-md text-white font-semibold hover:bg-green-400 cursor-pointer mt-2"
                    >
                        ດຳເນີນການຕໍ່
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Cart;
