import React, { useEffect, useState } from 'react'
import { categoryData, categoryData2, productData } from '../../../dataStore'

import food from '../../assets/food.webp'
import { message, Popconfirm, Modal, Form, Input, Upload, Select, Empty, Skeleton } from 'antd'
import { CloudUploadOutlined, UploadOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import { Button } from 'rsuite'
import UploadFileAdd from './UploadFileAdd'
import ModalProductEdit from './ModalProductEdit'
import useSafezoneStore from '../../store/safezoneStore'
import { insertFoodApi, deleteFoodApi, deleteDrinkApi } from '../../api/product'
import ModalFoodAdd from './ModalFoodAdd'
import ModalDrinkAdd from './ModalDrinkAdd'
import dayjs from 'dayjs'

const Product = () => {
    const navigate = useNavigate()

    const token = localStorage.getItem('token')
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSelected, setIsSelected] = useState('ທັງໝົດ');
    const [isLoading, setIsLoading] = useState(true);
    const [form, setForm] = useState({
        name: '',
        categoryId: 'ເລືອກປະເພດ',
        // qty: 0,
        price: 0,
        image: ''
    });
    const [selectedProduct, setSelectedProduct] = useState(null);

    // form store
    const categories = useSafezoneStore((state) => state.categories)
    const listCategory = useSafezoneStore((state) => state.listCategory)
    const food = useSafezoneStore((state) => state.food)
    const listFood = useSafezoneStore((state) => state.listFood)
    const drink = useSafezoneStore((state) => state.drink)
    const listDrink = useSafezoneStore((state) => state.listDrink)

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                await listCategory();
                await listFood();
                await listDrink();
            } catch (error) {
                console.error("Failed to fetch data:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
        console.log('food:', food);
        console.log('drink:', drink);
    }, [listCategory, listFood, listDrink]);
    console.log(form.image);



    const showModal = () => {
        setIsModalOpen(true);
    };
    const handleOk = () => {
        setIsModalOpen(false);
    };
    const handleCancel = () => {
        setIsModalOpen(false);
    };

    const handleDeleteFood = async (id, imageUrl) => {
        try {
            const response = await deleteFoodApi(id, imageUrl)
            listFood()
        } catch (error) {
            console.log(error);
        }
    }

    const handleDeleteDrink = async (id, imageUrl) => {
        try {
            const response = await deleteDrinkApi(id, imageUrl)
            listDrink()
        } catch (error) {
            console.log(error);
        }
    }

    const handleEditProduct = (product) => {
        setSelectedProduct(product);
        showModal();
    };

    return (
        <div className='min-h-screen p-2 bg-white rounded-md overflow-auto'>
            <ul className='p-2 flex items-center gap-4 overflow-x-auto h-[55px]'>
                {isLoading ? (
                    Array.from({ length: 5 }).map((_, index) => (
                        <li key={index} className='w-[120px] min-w-[120px]'>
                            <Skeleton.Button active={true} size="small" shape="round" block={true} />
                        </li>
                    ))
                ) : categories.length > 0 ? (
                    <>
                        <li
                            onClick={() => setIsSelected('ທັງໝົດ')}
                            className={`w-[120px] min-w-[120px] cursor-pointer text-center py-1.5 rounded shadow-md font-medium duration-300
                            ${isSelected === 'ທັງໝົດ'
                                    ? 'text-red-500 border-2 border-red-500 hover:text-red-600 shadow-[2px_2px_5px_0px_#f56565]'
                                    : 'border border-gray-700 text-gray-700 hover:border-red-600 hover:text-red-600 hover:shadow-[2px_2px_5px_0px_#f56565]'
                                }`}
                        >
                            ທັງໝົດ
                        </li>
                        {categories.map((categoryItem, index) => (
                            <li
                                onClick={() => setIsSelected(categoryItem.id)}
                                key={index}
                                className={`w-[120px] min-w-[120px] cursor-pointer text-center py-1.5 rounded shadow-md font-medium duration-300
                                ${isSelected === categoryItem.id
                                        ? 'text-red-500 border-2 border-red-500 hover:text-red-600 shadow-[2px_2px_5px_0px_#f56565]'
                                        : 'border border-gray-700 text-gray-700 hover:border-red-600 hover:text-red-600 hover:shadow-[2px_2px_5px_0px_#f56565]'
                                    }`}
                            >
                                {categoryItem.name}
                            </li>
                        ))}
                    </>
                ) : null}
            </ul>

            {/* <hr className=' border border-gray-100 my-1' /> */}

            <div className=' '>
                <div className=' flex justify-end my-2 gap-x-2'>
                    <button onClick={showModal}
                        className='h-[35px] w-[120px] rounded bg-green-500 text-center text-white border-2 border-transparent hover:border-2 hover:bg-transparent hover:border-green-500 hover:text-green-500 duration-300 cursor-pointer'>
                        ເພີ່ມອາຫານ
                    </button>
                    <ModalFoodAdd
                        isModalOpen={isModalOpen}
                        handleOk={handleOk}
                        handleCancel={handleCancel}
                        form={form}
                        setForm={setForm}
                        categories={categories}
                        listFood={listFood}
                    />
                    <ModalDrinkAdd
                        form={form}
                        setForm={setForm}
                        categories={categories}
                        listFood={listFood}
                    />
                </div>
                {isLoading ? (
                    <ul className=' grid grid-cols-5 place-items-center gap-4'>
                        {Array.from({ length: 10 }).map((_, index) => (
                            <li key={index} className={`flex flex-col items-center w-[230px] h-[260px] p-2 border border-gray-200 drop-shadow-md rounded-md bg-white`}>
                                <Skeleton.Image active={true} style={{ width: 214, height: 160, borderRadius: '6px' }} />
                                <div className='mt-2 w-full flex flex-col h-full'>
                                    <Skeleton active={true} paragraph={{ rows: 2 }} title={false} />
                                    <div className='flex items-end justify-between mt-auto'>
                                        <Skeleton.Input active={true} size="small" style={{ width: 80 }} />
                                        <div className='flex items-center gap-x-2'>
                                            <Skeleton.Button active={true} size="small" shape="round" style={{ width: 50 }} />
                                            <Skeleton.Button active={true} size="small" shape="round" style={{ width: 50 }} />
                                        </div>
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <ul className=' grid grid-cols-5 place-items-center gap-4'>
                        {
                            (food || []).map(f => ({ ...f, type: 'food' }))
                                .concat((drink || []).map(d => ({ ...d, type: 'drink' })))
                                .filter(productItem => isSelected === 'ທັງໝົດ' || productItem.categoryId === isSelected)
                                .map((productItem, index) => (
                                    <li key={index} className={` flex flex-col items-center w-[230px] h-[260px] p-2 border border-gray-200 drop-shadow-md rounded-md bg-white`}>
                                        <div className=' w-[220px] h-[160px] rounded-md'>
                                            <img src={productItem.imageUrl} alt=""
                                                className=' w-[220px] h-[160px] rounded-md object-cover'
                                            />
                                        </div>
                                        <div className=' mt-2 w-full flex flex-col h-full'>
                                            <div className=' flex-1'>
                                                <div className=' flex items-end justify-between'>
                                                    <p className=' text-[16px] font-medium'>
                                                        {productItem.name}
                                                    </p>
                                                    <h4 className=' text-[18px] font-semibold text-red-500'>{(productItem.price).toLocaleString()} ກີບ</h4>
                                                </div>
                                            </div>
                                            {
                                                productItem.type === 'drink' ? (
                                                    <p className=' flex items-center gap-x-1 text-[12px]'>
                                                        ຈຳນວນຍັງເຫຼືອ : <span>
                                                            {productItem.qty ? productItem.qty : 0}
                                                        </span>
                                                    </p>
                                                ) : null
                                            }
                                            <div className=' flex items-end justify-between'>
                                                <span className=' text-[12px]'>{dayjs(productItem.createdAt).format('DD-MM-YYYY')}</span>
                                                <div className=' flex items-center gap-x-2'>
                                                    <button onClick={() => handleEditProduct(productItem)}
                                                        className=' bg-blue-500 text-[12px] text-white w-[50px] py-0.5 rounded border-1 border-transparent hover:border-1 hover:bg-transparent hover:border-blue-500 hover:text-blue-500 duration-300 cursor-pointer'>
                                                        ແກ້ໄຂ
                                                    </button>
                                                    <Popconfirm
                                                        title="ຄຳຢືນຢັນ"
                                                        description="ເຈົ້າຕ້ອງການລົບລາຍການນີ້ບໍ່ ?"
                                                        okText="ຢືນຢັນ"
                                                        cancelText="ຍົກເລີກ"
                                                        onConfirm={() => {
                                                            if (productItem.type === 'drink') {
                                                                handleDeleteDrink(productItem.id, productItem.imageUrl)
                                                            } else {
                                                                handleDeleteFood(productItem.id, productItem.imageUrl)
                                                            }
                                                        }}
                                                    >
                                                        <button
                                                            className=' bg-red-500 text-[12px] text-white w-[50px] py-0.5 rounded border-1 border-transparent hover:border-1 hover:bg-transparent hover:border-red-500 hover:text-red-500 duration-300 cursor-pointer'>
                                                            ລົບ
                                                        </button>
                                                    </Popconfirm>
                                                </div>
                                            </div>
                                        </div>
                                    </li>
                                ))
                        }
                        {!isLoading && (!food?.length && !drink?.length) && (
                            <div className="col-span-5 w-full py-8">
                                <Empty description="ບໍ່ມີຂໍ້ມູນ" />
                            </div>
                        )}
                    </ul>
                )}
                {selectedProduct && (
                    <ModalProductEdit
                        product={selectedProduct}
                        isModalOpen={isModalOpen}
                        handleOk={handleOk}
                        handleCancel={handleCancel}
                        isDrink={selectedProduct.type === 'drink'}
                        categories={categories}
                        listFood={listFood}
                        listDrink={listDrink}
                        setSelectedProduct={setSelectedProduct}
                    />
                )}
            </div >
        </div >
    )
}

export default Product