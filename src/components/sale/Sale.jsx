import React, { useEffect, useRef, useState } from "react";
import useSafezoneStore from "../../store/safezoneStore";
import { MdOutlineKeyboardDoubleArrowLeft, MdKeyboardDoubleArrowRight, MdOutlineShoppingCart } from "react-icons/md";
import { message } from "antd";
import Cart from "./Cart";

const Sale = () => {
    const [activeCategory, setActiveCategory] = useState(null);
    const categories = useSafezoneStore((state) => state.categories);
    const food = useSafezoneStore((state) => state.food);
    const drink = useSafezoneStore((state) => state.drink);
    const listFood = useSafezoneStore((state) => state.listFood);
    const listDrink = useSafezoneStore((state) => state.listDrink);
    const actionAddToCart = useSafezoneStore((state) => state.actionAddToCart);
    const listCart = useSafezoneStore((state) => state.listCart);
    const token = useSafezoneStore((state) => state.token);

    const scrollRef = useRef(null);
    const [showArrows, setShowArrows] = useState(false);

    useEffect(() => {
        listDrink();
        listFood();
        if (token) {
            listCart(token); // Load cart data when component mounts
        }
    }, [token]);

    useEffect(() => {
        const checkScroll = () => {
            if (scrollRef.current) {
                const { scrollWidth, clientWidth } = scrollRef.current;
                setShowArrows(scrollWidth > clientWidth);
            }
        };
        checkScroll();
        window.addEventListener("resize", checkScroll);
        return () => window.removeEventListener("resize", checkScroll);
    }, [categories]);

    const scroll = (direction) => {
        if (scrollRef.current) {
            const scrollAmount = 300;
            scrollRef.current.scrollLeft += direction === "left" ? -scrollAmount : scrollAmount;
        }
    };

    const handleCategoryClick = (categoryId) => {
        setActiveCategory((prev) => (prev === categoryId ? null : categoryId));
    };

    const handleAddToCart = async (item) => {
        if (!token) return message.error("Please log in first");

        const cartData = {
            cart: [
                {
                    itemId: parseInt(item.id),
                    itemType: item.categoryId === 1 ? "drink" : "food",
                    qty: 1,
                    price: parseInt(item.price)
                }
            ]
        };

        await actionAddToCart(token, cartData);
        await listCart(token); // Reload cart after adding item
    };

    const allProducts = [...(food ?? []), ...(drink ?? [])];

    const filteredProducts = allProducts.filter(
        (product) => !activeCategory || product.categoryId === activeCategory
    );

    return (
        <div className="h-screen">
            <h1 className="text-[20px] font-semibold">ໜ້າການຂາຍ</h1>
            <div className="flex gap-x-5 mt-2 h-[calc(100%-40px)]">
                <div className="bg-white flex-3 p-5 rounded h-full overflow-y-auto">
                    <div className="w-full relative">
                        <ul ref={scrollRef} className="flex gap-x-4 h-[55px] overflow-x-auto w-full max-w-[920px] scroll-smooth scrollbar-hide">
                            <li
                                onClick={() => handleCategoryClick(null)}
                                className={`cursor-pointer duration-300 hover:border-red-600 hover:text-red-600 w-[200px] rounded-md bg-white h-[45px] flex items-center justify-center border border-gray-700 text-gray-700 font-medium
                                ${activeCategory === null ? "text-red-500 border-2 border-red-500 shadow-[2px_2px_5px_0px_#f56565]" : ""}`}
                            >
                                <p>ທັງໝົດ</p>
                            </li>
                            {categories.map((item) => (
                                <li
                                    key={item.id}
                                    onClick={() => handleCategoryClick(item.id)}
                                    className={`cursor-pointer duration-300 hover:border-red-600 hover:text-red-600 w-[200px] rounded-md bg-white h-[45px] flex items-center justify-center border border-gray-700 text-gray-700 font-medium
                                    ${activeCategory === item.id ? "text-red-500 border-2 border-red-500 shadow-[2px_2px_5px_0px_#f56565]" : ""}`}
                                >
                                    <p>{item.name}</p>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="mt-5">
                        <ul className="grid grid-cols-5 gap-2">
                            {filteredProducts.map((item) => (
                                <li key={item.id} className="border border-gray-200 w-[170px] h-[210px] rounded-xl shadow-md p-1 flex flex-col justify-between">
                                    <div className="h-[140px] w-full rounded-xl">
                                        <img src={item.imageUrl} alt="" className="object-cover w-full h-full rounded-xl" />
                                    </div>
                                    <div className="p-1">
                                        <p className="font-medium">{item.name}</p>
                                        <div className="flex justify-between items-center">
                                            <p className="text-[18px] font-semibold text-red-500">
                                                {parseInt(item.price).toLocaleString()} ກີບ
                                            </p>
                                            <div
                                                onClick={() => handleAddToCart(item)}
                                                className="bg-yellow-100 w-[30px] h-[30px] rounded flex justify-center items-center hover:bg-yellow-200 active:scale-95 transition-all cursor-pointer"
                                            >
                                                <MdOutlineShoppingCart className="text-yellow-500 text-[20px]" />
                                            </div>
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
                <Cart />
            </div>
        </div>
    );
};

export default Sale;
