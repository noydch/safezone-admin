import React, { useEffect, useState } from "react";
import useSafezoneStore from "../../store/safezoneStore";
import { MdOutlineShoppingCart } from "react-icons/md";
import { message, Skeleton } from "antd";
import Cart from "./Cart";
import { getProductUnitsByDrinkIdApi } from '../../api/productUnit';
import { getCategoryByIdApi } from '../../api/category.js'

const Sale = () => {
    const [activeCategory, setActiveCategory] = useState(null);
    const [productTypeFilter, setProductTypeFilter] = useState('all'); // all | food | drink
    const [isLoading, setIsLoading] = useState(true);
    // New state to hold products fetched specifically for a category
    const [categorySpecificProducts, setCategorySpecificProducts] = useState(null);

    const categories = useSafezoneStore((state) => state.categories);
    const food = useSafezoneStore((state) => state.food);
    const drink = useSafezoneStore((state) => state.drink);
    const listFood = useSafezoneStore((state) => state.listFood);
    const listDrink = useSafezoneStore((state) => state.listDrink);
    const actionAddToCart = useSafezoneStore((state) => state.actionAddToCart);
    const actionUpdateCart = useSafezoneStore((state) => state.actionUpdateCart);
    const token = useSafezoneStore((state) => state.token);


    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                // Fetch all food and drink initially from store actions
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

    const handleCategoryClick = async (categoryId) => { // Made async
        setActiveCategory(categoryId); // Set active category for styling

        if (categoryId === null) {
            // If 'All' category is selected, clear category-specific products
            setCategorySpecificProducts(null);
            // Re-fetch all products if needed, or rely on existing store data
            // await Promise.all([listDrink(), listFood()]); // Uncomment if 'All' needs fresh data
        } else {
            setIsLoading(true); // Show loading when fetching category data
            try {
                // Fetch products for the specific category
                const response = await getCategoryByIdApi(categoryId);
                if (response?.data) {
                    const fetchedFoods = response.data.foods?.map(f => ({ ...f, type: 'food' })) || [];
                    const fetchedDrinks = response.data.drinks?.map(d => ({ ...d, type: 'drink' })) || [];
                    setCategorySpecificProducts([...fetchedFoods, ...fetchedDrinks]);
                } else {
                    setCategorySpecificProducts([]); // No data found for category
                }
            } catch (error) {
                console.error('[Sale.jsx] Error fetching category products:', error);
                message.error('ເກີດຂໍ້ຜິດພາດໃນການໂຫຼດສິນຄ້າຕາມປະເພດ.');
                setCategorySpecificProducts([]);
            } finally {
                setIsLoading(false);
            }
        }
    };

    const handleAddToCart = async (item) => {
        if (!token) {
            message.error("ກະລຸນາເຂົ້າສູ່ລະບົບກ່ອນ");
            return;
        }

        const category = categories.find(cat => cat.id === item?.categoryId);
        const categoryName = category ? category.name : '';
        const itemType = categoryName.includes('ເຄື່ອງດື່ມ') ? 'drink' : 'food';

        if (itemType === 'drink') {
            try {
                const response = await getProductUnitsByDrinkIdApi(token, item.id);
                if (response?.data?.length > 0) {
                    const firstUnit = response.data[0];
                    actionAddToCart({
                        id: item?.id,
                        name: firstUnit.name,
                        productName: item?.name,
                        price: firstUnit.price,
                        imageUrl: item?.imageUrl,
                        type: itemType,
                        selectedUnitId: firstUnit.id,
                        productUnits: response.data
                    });
                } else {
                    message.warning('ບໍ່ພົບຫົວໜ່ວຍສິນຄ້າສໍາລັບເຄື່ອງດື່ມນີ້.');
                }
            } catch (error) {
                console.error('[Sale.jsx] Error fetching product units:', error.response?.data || error.message);
                message.error('ເກີດຂໍ້ຜິດພາດໃນການເພີ່ມເຄື່ອງດື່ມ.');
            }
        } else {
            actionAddToCart({
                id: item?.id,
                name: item?.name,
                price: parseInt(item?.price),
                imageUrl: item?.imageUrl,
                type: itemType
            });
        }
    };

    const handleUpdateCart = (cartItemId, qty) => {
        if (!token) return message.error("Please log in first");
        if (qty <= 0) return message.error("Quantity must be greater than zero");
        actionUpdateCart(token, { cartItemId, qty });
    };

    // Adjust allProducts to use categorySpecificProducts if available, otherwise global store data
    const displayedProducts = categorySpecificProducts !== null ? categorySpecificProducts : [
        ...(food?.map(f => ({ ...f, type: 'food' })) ?? []),
        ...(drink?.map(d => ({ ...d, type: 'drink' })) ?? [])
    ];

    const filteredProducts = displayedProducts.filter(product => {
        // Only apply productTypeFilter here, as category filtering is now handled by API call
        const matchType = productTypeFilter === 'all' || product.type === productTypeFilter;
        // The category is already implicitly filtered if categorySpecificProducts is used
        // If categorySpecificProducts is null (i.e., 'All' categories are selected),
        // then `displayedProducts` is `allProducts`, and `activeCategory` will filter locally.
        const matchCategory = !activeCategory || product.categoryId === activeCategory; // Keep for 'All' case or if product data from store isn't consistent

        // For category-specific fetched products, `matchCategory` will always be true
        // if `activeCategory` is not null and the product correctly belongs to that category.
        return matchType && matchCategory;
    });

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
                <div className="bg-white flex-5 p-5 rounded h-full overflow-y-auto">
                    <div className="w-full">
                        {/* Filter by category */}
                        <ul className="grid grid-cols-4 gap-2 mb-4">
                            <li
                                onClick={() => handleCategoryClick(null)}
                                className={`cursor-pointer text-center duration-300 hover:border-red-600 hover:text-red-600 min-h-[45px] rounded-md bg-white flex items-center justify-center border-2 border-gray-700 text-gray-700 font-medium p-2
                                    ${activeCategory === null ? "text-red-500 border-2 border-red-500 shadow-[2px_2px_5px_0px_#f56565]" : ""}`}
                            >
                                <p>ທັງໝົດ</p>
                            </li>
                            {categories?.map((item) => (
                                <li
                                    key={item?.id}
                                    onClick={() => handleCategoryClick(item.id)}
                                    className={`cursor-pointer text-center duration-300 hover:border-red-600 hover:text-red-600 min-h-[45px] rounded-md bg-white flex items-center justify-center border-2 border-gray-700 text-gray-700 font-medium p-2
                                        ${activeCategory === item?.id ? "text-red-500 border-2 border-red-500 shadow-[2px_2px_5px_0px_#f56565]" : ""}`}
                                >
                                    <p>{item?.name}</p>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Products list */}
                    <div className="mt-5">
                        {isLoading ? (
                            <ul className="grid grid-cols-4 gap-2">{renderSkeleton()}</ul>
                        ) : (
                            <ul className="grid grid-cols-4 gap-2">
                                {filteredProducts?.map((item) => (
                                    <li key={item?.id} className="border relative border-gray-200 w-[180px] h-[220px] rounded-xl shadow-md p-1 flex flex-col">
                                        <div className="h-[150px] w-full border border-gray-200 rounded-xl p-1 bg-white">
                                            <img src={item?.imageUrl} alt={item?.name} className="object-cover w-full h-full rounded-xl" />
                                        </div>
                                        <p className="px-1.5 text-[15px] font-medium flex-grow break-words mt-1.5">
                                            {item?.name}
                                        </p>
                                        <div
                                            onClick={() => handleAddToCart(item)}
                                            className="bg-yellow-100 absolute bottom-2 right-2 w-[30px] h-[30px] rounded flex justify-center items-center hover:bg-yellow-200 active:scale-95 transition-all cursor-pointer"
                                        >
                                            <MdOutlineShoppingCart className="text-yellow-500 text-[20px]" />
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
