import { message, Select } from 'antd';
import React from 'react';
import { FaRegTrashAlt } from 'react-icons/fa';
import { HiMinus, HiPlus } from 'react-icons/hi';
import useSafezoneStore from '../../store/safezoneStore';

const Cart = () => {
    const carts = useSafezoneStore((state) => state.carts);
    const token = useSafezoneStore((state) => state.token);
    const listCart = useSafezoneStore((state) => state.listCart);
    const actionUpdateCart = useSafezoneStore((state) => state.actionUpdateCart);
    const actionRemoveFromCart = useSafezoneStore((state) => state.actionRemoveFromCart);

    const handleUpdateCart = async (cartItemId, qty) => {
        if (qty <= 0) return;
        await actionUpdateCart(token, { cartItemId, qty });
        await listCart(token);
    };

    const handleRemoveItem = async (cartItemId) => {
        await actionRemoveFromCart(token, cartItemId);
        await listCart(token);
    };

    return (
        <div className="flex-1 bg-white rounded-md py-2 px-2">
            <h1 className="text-[24px] text-center font-semibold text-gray-700">ກະຕ່າສິນຄ້າ</h1>
            <ul className="mt-4">
                {carts.map((item) => (
                    <li key={item.id} className="flex justify-between border p-2 rounded-md">
                        <p>{item.name}</p>
                        <div className="flex gap-2">
                            <button onClick={() => handleUpdateCart(item.id, item.qty - 1)}><HiMinus /></button>
                            <span>{item.qty}</span>
                            <button onClick={() => handleUpdateCart(item.id, item.qty + 1)}><HiPlus /></button>
                        </div>
                        <FaRegTrashAlt onClick={() => handleRemoveItem(item.id)} className="cursor-pointer" />
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Cart;
