import React, { useEffect, useRef, useState } from "react";
import useSafezoneStore from "../../store/safezoneStore";
import { MdOutlineKeyboardDoubleArrowLeft, MdKeyboardDoubleArrowRight, MdOutlineShoppingCart } from "react-icons/md";
import { message, Skeleton } from "antd";
import Cart from "./Cart";

const Sale = () => {
    const [activeCategory, setActiveCategory] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const categories = useSafezoneStore((state) => state.categories);
    const food = useSafezoneStore((state) => state.food);
    const drink = useSafezoneStore((state) => state.drink);
    const listFood = useSafezoneStore((state) => state.listFood);
    const listDrink = useSafezoneStore((state) => state.listDrink);
    const actionAddToCart = useSafezoneStore((state) => state.actionAddToCart);
    const actionUpdateCart = useSafezoneStore((state) => state.actionUpdateCart); // Add update action
    const token = useSafezoneStore((state) => state.token);

    const scrollRef = useRef(null);
    const [showArrows, setShowArrows] = useState(false);

    // Load food and drink data
    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                await Promise.all([listDrink(), listFood()]);
            } catch (error) {
                console.error("Failed to fetch data:", error);
                message.error("ເກີດຂໍ້ຜິດພາດໃນການໂຫຼດຂໍ້ມູນ");
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, [listDrink, listFood]);

    // Check if category menu can scroll
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

    // Scroll category menu
    const scroll = (direction) => {
        if (scrollRef.current) {
            const scrollAmount = 300;
            scrollRef.current.scrollLeft += direction === "left" ? -scrollAmount : scrollAmount;
        }
    };

    // Handle category click
    const handleCategoryClick = (categoryId) => {
        setActiveCategory((prev) => (prev === categoryId ? null : categoryId));
    };

    // Handle add to cart
    const handleAddToCart = (item) => {
        if (!token) return message.error("Please log in first");

        actionAddToCart({
            id: item?.id,
            name: item?.name,
            price: parseInt(item?.price),
            imageUrl: item?.imageUrl,
            type: item?.categoryId === 3 ? "drink" : "food"
        });
    };

    // Handle update cart quantity
    const handleUpdateCart = (cartItemId, qty) => {
        if (!token) return message.error("Please log in first");

        if (qty <= 0) return message.error("Quantity must be greater than zero");

        actionUpdateCart(token, { cartItemId, qty });
    };

    // Combine food and drink
    const allProducts = [...(food ?? []), ...(drink ?? [])];

    // Filter products by category
    const filteredProducts = allProducts.filter(
        (product) => !activeCategory || product?.categoryId === activeCategory
    );

    // Function to render skeleton items
    const renderSkeleton = () => {
        return Array.from({ length: 10 }).map((_, index) => (
            <li key={index} className="border border-gray-200 w-[170px] h-[210px] rounded-xl shadow-md p-1 flex flex-col justify-between">
                <Skeleton.Image active style={{ width: '100%', height: '140px', borderRadius: '0.75rem' }} />
                <div className="p-1 mt-1">
                    <Skeleton.Input active size="small" style={{ width: '80%' }} />
                    <div className="flex justify-between items-center mt-1">
                        <Skeleton.Input active size="small" style={{ width: '50%' }} />
                        <Skeleton.Button active size="small" shape="circle" />
                    </div>
                </div>
            </li>
        ));
    };

    return (
        <div className="h-screen">
            <h1 className="text-[20px] font-semibold">ໜ້າການຂາຍ</h1>
            <div className="flex gap-x-5 mt-2 h-[calc(100%-40px)]">
                <div className="bg-white flex-3 p-5 rounded h-full overflow-y-auto">
                    <div className="w-full relative">
                        {/* Category menu */}
                        <ul ref={scrollRef} className="flex gap-x-4 h-[55px] overflow-x-auto w-full max-w-[920px] scroll-smooth scrollbar-hide">
                            <li
                                onClick={() => handleCategoryClick(null)}
                                className={`cursor-pointer duration-300 hover:border-red-600 hover:text-red-600 w-[200px] rounded-md bg-white h-[45px] flex items-center justify-center border border-gray-700 text-gray-700 font-medium
                                ${activeCategory === null ? "text-red-500 border-2 border-red-500 shadow-[2px_2px_5px_0px_#f56565]" : ""}`}
                            >
                                <p>ທັງໝົດ</p>
                            </li>
                            {categories?.map((item) => (
                                <li
                                    key={item?.id}
                                    onClick={() => handleCategoryClick(item.id)}
                                    className={`cursor-pointer duration-300 hover:border-red-600 hover:text-red-600 w-[200px] rounded-md bg-white h-[45px] flex items-center justify-center border border-gray-700 text-gray-700 font-medium
                                    ${activeCategory === item?.id ? "text-red-500 border-2 border-red-500 shadow-[2px_2px_5px_0px_#f56565]" : ""}`}
                                >
                                    <p>{item?.name}</p>
                                </li>
                            ))}
                        </ul>

                        {/* Scroll buttons */}
                        {showArrows && (
                            <>
                                <button
                                    onClick={() => scroll("left")}
                                    className="absolute left-[-30px] top-1/2 -translate-y-1/2 bg-red-500 text-white p-1 rounded-full shadow border-2 hover:bg-white hover:text-red-500 hover:border-red-500 cursor-pointer"
                                >
                                    <MdOutlineKeyboardDoubleArrowLeft size={20} />
                                </button>
                                <button
                                    onClick={() => scroll("right")}
                                    className="absolute right-[-30px] top-1/2 -translate-y-1/2 bg-red-500 text-white p-1 rounded-full shadow border-2 hover:bg-white hover:text-red-500 hover:border-red-500 cursor-pointer"
                                >
                                    <MdKeyboardDoubleArrowRight size={20} />
                                </button>
                            </>
                        )}
                    </div>

                    {/* Products list */}
                    <div className="mt-5">
                        {isLoading ? (
                            <ul className="grid grid-cols-5 gap-2">
                                {renderSkeleton()}
                            </ul>
                        ) : (
                            <ul className="grid grid-cols-5 gap-2">
                                {filteredProducts?.map((item) => (
                                    <li key={item?.id} className="border border-gray-200 w-[170px] h-[210px] rounded-xl shadow-md p-1 flex flex-col justify-between">
                                        <div className="h-[140px] w-full rounded-xl">
                                            <img src={item?.imageUrl} alt={item?.name} className="object-cover w-full h-full rounded-xl" />
                                        </div>
                                        <div className="p-1">
                                            <p className="font-medium">{item?.name}</p>
                                            <div className="flex justify-between items-center">
                                                <p className="text-[18px] font-semibold text-red-500">
                                                    {parseInt(item?.price).toLocaleString()} ກີບ
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
                                {!isLoading && filteredProducts.length === 0 && (
                                    <p className="col-span-5 text-center text-gray-500 mt-4">ບໍ່ພົບລາຍການສິນຄ້າ.</p>
                                )}
                            </ul>
                        )}
                    </div>
                </div>
                {/* Cart */}
                <Cart onUpdateCart={handleUpdateCart} />
            </div>
        </div>
    );
};

export default Sale;
