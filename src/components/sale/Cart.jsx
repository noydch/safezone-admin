import { message, Select } from 'antd';
import React, { useEffect, useState } from 'react';
import { FaRegTrashAlt } from 'react-icons/fa';
import { HiMinus, HiPlus } from 'react-icons/hi';
import { toast } from 'react-toastify';
import useSafezoneStore from '../../store/safezoneStore';

const Cart = () => {
    const [count, setCount] = useState(1); // Used to handle the quantity for the selected item
    const [selectedTable, setSelectedTable] = useState(null); // To manage table selection
    const carts = useSafezoneStore((state) => state.carts);
    const token = useSafezoneStore((state) => state.token);
    // const listCart = useSafezoneStore((state) => state.listCart);
    const actionAddToCart = useSafezoneStore((state) => state.actionAddToCart);
    const actionRemoveFromCart = useSafezoneStore((state) => state.actionRemoveFromCart);


    const handleChange = (value) => {
        setSelectedTable(value); // Updating selected table
        console.log(value);
    };

    const decrementCount = (cartId) => {
        if (count > 1) {
            setCount(count - 1);
        }
    };

    const incrementCount = (cartId) => {
        setCount(count + 1);
    };

    const handleRemoveItem = async (cartItemId) => {
        try {
            await actionRemoveFromCart(token, cartItemId);
            toast.success("Item removed from cart!");
        } catch (error) {
            toast.error("Failed to remove item!");
        }
    };

    const getTotalPrice = () => {
        return carts.reduce((total, item) => {
            return total + (item.qty * item.price);
        }, 0);
    };

    return (
        <div className="flex-1 bg-white rounded-md py-2 px-2">
            <h1 className="text-[24px] text-center font-semibold text-gray-700">
                ກະຕ່າສິນຄ້າ
            </h1>
            <div className="mt-4">
                <div className="mb-2 flex items-center justify-center gap-x-2">
                    <p>ເລືອກໂຕະ: </p>
                    <Select
                        labelInValue
                        defaultValue={{
                            value: '0',
                            label: 'ກະລຸນາເລືອກໂຕະ',
                        }}
                        style={{
                            width: 140,
                        }}
                        onChange={handleChange}
                        options={[
                            { value: '1', label: 'ໂຕະທີ 1' },
                            { value: '2', label: 'ໂຕະທີ 2' },
                        ]}
                    />
                </div>

                <ul className="flex flex-col gap-2">
                    {carts.map((item) => (
                        <li
                            key={item.id}
                            className="w-full h-[80px] relative flex border border-gray-300 rounded p-1"
                        >
                            <img
                                src={item.itemType === 'food' ? item.Food.imageUrl : item.Drink.imageUrl}
                                alt=""
                                className="w-[70px] h-full object-cover rounded"
                            />
                            <div className="flex justify-between w-full ml-1.5 py-1">
                                <div className="flex flex-col justify-between h-full">
                                    <p className="font-medium">
                                        {item.itemType === 'food' ? item.Food.name : item.Drink.name}
                                    </p>
                                    <div className="flex items-center w-[80px] justify-between border rounded border-gray-200">
                                        <div
                                            onClick={() => decrementCount(item.id)}
                                            className="cursor-pointer bg-gray-200 w-[24px] h-[24px] rounded flex items-center justify-center"
                                        >
                                            <HiMinus className="text-[14px]" />
                                        </div>
                                        <span className="text-[14px] font-medium">{item.qty}</span>
                                        <div
                                            onClick={() => incrementCount(item.id)}
                                            className="cursor-pointer bg-gray-200 w-[24px] h-[24px] rounded flex items-center justify-center"
                                        >
                                            <HiPlus className="text-[14px]" />
                                        </div>
                                    </div>
                                </div>
                                <div className="flex flex-col items-end justify-between pr-1">
                                    <FaRegTrashAlt
                                        className="text-red-700 cursor-pointer"
                                        onClick={() => handleRemoveItem(item.id)}
                                    />
                                    <p className="font-semibold">
                                        {item.price * item.qty} ກີບ
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