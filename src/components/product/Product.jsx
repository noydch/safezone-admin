import React, { useEffect, useState } from 'react';
import { Table, Image, Button, Popconfirm, message, Skeleton, Empty, Tag } from 'antd';
import { FaSpinner } from 'react-icons/fa';
import dayjs from 'dayjs';
import useSafezoneStore from '../../store/safezoneStore';
import { useAuth } from '../../context/AuthContext';
import { deleteFoodApi, deleteDrinkApi } from '../../api/product';
import ModalFoodAdd from './ModalFoodAdd';
import ModalDrinkAdd from './ModalDrinkAdd';
import ModalFoodEdit from './ModalFoodEdit';
import ModalDrinkEdit from './ModalDrinkEdit';

const Product = () => {
    const { user } = useAuth();
    const [isFoodModalOpen, setIsFoodModalOpen] = useState(false);
    const [isSelected, setIsSelected] = useState('ທັງໝົດ');
    const [isLoading, setIsLoading] = useState(true);
    const [form, setForm] = useState({
        name: '',
        categoryId: 'ເລືອກປະເພດ',
        price: 0,
        image: ''
    });
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [deletingId, setDeletingId] = useState(null);

    // Zustand Store
    const categories = useSafezoneStore((state) => state.categories);
    const listCategory = useSafezoneStore((state) => state.listCategory);
    const food = useSafezoneStore((state) => state.food);
    const listFood = useSafezoneStore((state) => state.listFood);
    const drink = useSafezoneStore((state) => state.drink);
    const listDrink = useSafezoneStore((state) => state.listDrink);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                await listCategory();
                await listFood();
                await listDrink();
            } catch (error) {
                console.error("Failed to fetch data:", error);
                message.error("ບໍ່ສາມາດໂຫຼດຂໍ້ມູນໄດ້");
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [listCategory, listFood, listDrink]);

    // Handlers
    const showFoodModal = () => {
        if (user?.role === 'Owner' || user?.role === 'Manager') {
            setIsFoodModalOpen(true);
        } else {
            message.error('ທ່ານບໍ່ມີສິດໃນການເພີ່ມອາຫານ');
        }
    };

    const handleDelete = async (product) => {
        if (user?.role !== 'Owner' && user?.role !== 'Manager') {
            message.error('ທ່ານບໍ່ມີສິດລົບລາຍການນີ້');
            return;
        }
        try {
            setDeletingId(product.id);
            if (product.type === 'food') {
                await deleteFoodApi(product.id, product.imageUrl);
                await listFood();
            } else {
                await deleteDrinkApi(product.id, product.imageUrl);
                await listDrink();
            }
            message.success('ລົບລາຍການສຳເລັດ');
        } catch (error) {
            console.error(error);
            message.error('ເກີດຂໍ້ຜິດພາດໃນການລົບ');
        } finally {
            setDeletingId(null);
        }
    };

    const handleEditProduct = (product) => {
        if (user?.role === 'Owner' || user?.role === 'Manager') {
            setSelectedProduct(product);
        } else {
            message.error('ທ່ານບໍ່ມີສິດໃນການແກ້ໄຂ');
        }
    };

    const getCategoryName = (categoryId) => {
        const category = categories.find(cat => cat.id === categoryId);
        return category ? category.name : 'ບໍ່ມີປະເພດ';
    };

    // Table Columns
    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
            width: 80, // Optional: Adjust width as needed
        },
        {
            title: 'ຮູບພາບ',
            dataIndex: 'imageUrl',
            key: 'imageUrl',
            render: (text) => <Image className=' object-contain' width={90} height={90} src={text} style={{ objectFit: 'cover', borderRadius: '4px', padding: '2px', border: '2px solid #f0f0f0' }} />,
        },
        {
            title: 'ຊື່ລາຍການ',
            dataIndex: 'name',
            key: 'name',
            sorter: (a, b) => a.name.localeCompare(b.name),
        },
        {
            title: 'ປະເພດ',
            dataIndex: 'categoryId',
            key: 'categoryId',
            render: (categoryId) => <Tag color="blue">{getCategoryName(categoryId)}</Tag>,
            filters: categories.map(cat => ({ text: cat.name, value: cat.id })),
            onFilter: (value, record) => record.categoryId === value,
        },
        {
            title: 'ລາຄາ',
            dataIndex: 'price',
            key: 'price',
            render: (_, record) => (
                <span>
                    {record.type === 'drink'
                        ? record.productUnits?.length > 0
                            ? `${Math.min(...record.productUnits.map(unit => unit.price)).toLocaleString()} ກີບ`
                            : '0 ກີບ'
                        : `${(record.price || 0).toLocaleString()} ກີບ`}
                </span>
            ),
            sorter: (a, b) => {
                const priceA = a.type === 'drink' ? (a.productUnits?.length ? Math.min(...a.productUnits.map(unit => unit.price)) : 0) : a.price;
                const priceB = b.type === 'drink' ? (b.productUnits?.length ? Math.min(...b.productUnits.map(unit => unit.price)) : 0) : b.price;
                return priceA - priceB;
            },
        },
        {
            title: 'ຈຳນວນ (ເຄື່ອງດື່ມ)',
            dataIndex: 'qty',
            key: 'qty',
            render: (qty, record) => (record.type === 'drink' ? (qty || 0) : 'N/A'),
        },
        {
            title: 'ວັນທີສ້າງ',
            dataIndex: 'createdAt',
            key: 'createdAt',
            render: (text) => dayjs(text).format('DD-MM-YYYY'),
            sorter: (a, b) => dayjs(a.createdAt).unix() - dayjs(b.createdAt).unix(),
        },
        {
            title: 'ການກະທຳ',
            key: 'action',
            render: (_, record) => (
                <div className='flex items-center gap-x-2'>
                    <Button type="primary" onClick={() => handleEditProduct(record)}>ແກ້ໄຂ</Button>
                    <Popconfirm
                        title="ຢືນຢັນການລົບ"
                        description="ທ່ານຕ້ອງການລົບລາຍການນີ້ແທ້ບໍ່?"
                        onConfirm={() => handleDelete(record)}
                        okText="ຢືນຢັນ"
                        cancelText="ຍົກເລີກ"
                        disabled={deletingId === record.id || (user?.role !== 'Owner' && user?.role !== 'Manager')}
                    >
                        <Button type="primary" danger loading={deletingId === record.id} disabled={deletingId === record.id || (user?.role !== 'Owner' && user?.role !== 'Manager')}>
                            {deletingId === record.id ? <FaSpinner className='animate-spin' /> : 'ລົບ'}
                        </Button>
                    </Popconfirm>
                </div>
            ),
        },
    ];

    // Prepare data source
    const dataSource = [
        ...food.map(f => ({ ...f, type: 'food', key: `food-${f.id}` })),
        ...drink.map(d => ({ ...d, type: 'drink', key: `drink-${d.id}` }))
    ].filter(item => isSelected === 'ທັງໝົດ' || item.categoryId === isSelected);

    return (
        <div className='min-h-screen p-4 bg-white rounded-md'>
            <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4'>
                <ul className='flex items-center gap-2 overflow-x-auto pb-2'>
                    {isLoading ? (
                        Array.from({ length: 4 }).map((_, index) => (
                            <li key={index} className='w-[120px]'>
                                <Skeleton.Button active={true} size="small" shape="round" block={true} />
                            </li>
                        ))
                    ) : (
                        <>
                            <li
                                onClick={() => setIsSelected('ທັງໝົດ')}
                                className={`px-4 py-1.5 rounded-full cursor-pointer font-medium duration-200 border ${isSelected === 'ທັງໝົດ' ? 'bg-red-500 text-white border-red-500' : 'bg-white text-gray-700 border-gray-300 hover:border-red-500 hover:text-red-500'}`}
                            >
                                ທັງໝົດ
                            </li>
                            {categories.map(categoryItem => (
                                <li
                                    key={categoryItem.id}
                                    onClick={() => setIsSelected(categoryItem.id)}
                                    className={`px-4 py-1.5 rounded-full cursor-pointer font-medium duration-200 border text-nowrap ${isSelected === categoryItem.id ? 'bg-red-500 text-white border-red-500' : 'bg-white text-gray-700 border-gray-300 hover:border-red-500 hover:text-red-500'}`}
                                >
                                    {categoryItem.name}
                                </li>
                            ))}
                        </>
                    )}
                </ul>

            </div>
            <div className='flex items-center justify-end gap-2 mb-5'>
                <div className='flex gap-x-2'>
                    <button onClick={showFoodModal}
                        className='h-[35px] w-[120px] rounded bg-green-500 text-center text-white border-2 border-transparent hover:border-2 hover:bg-transparent hover:border-blue-500 hover:text-blue-500 duration-300 cursor-pointer'>
                        ເພີ່ມເພີ່ມອາຫານ
                    </button>
                    {/* Note: Assuming ModalDrinkAdd is opened via another button or logic */}
                    {/* <Button type="primary">ເພີ່ມເຄື່ອງດື່ມ</Button> */}
                </div>
                <ModalDrinkAdd
                    form={form}
                    setForm={setForm}
                    categories={categories}
                    listDrink={listDrink}
                    user={user}
                />
            </div>
            <Table
                columns={columns}
                dataSource={dataSource}
                loading={isLoading}
                rowKey="key"
                locale={{ emptyText: <Empty description="ບໍ່ມີຂໍ້ມູນ" /> }}
                scroll={{ x: 'max-content' }}
            />

            {/* Modals */}
            <ModalFoodAdd
                isModalOpen={isFoodModalOpen}
                handleOk={() => setIsFoodModalOpen(false)}
                handleCancel={() => setIsFoodModalOpen(false)}
                form={form}
                setForm={setForm}
                categories={categories}
                listFood={listFood}
                user={user}
            />


            {selectedProduct && (
                selectedProduct.type === 'drink' ? (
                    <ModalDrinkEdit
                        product={selectedProduct}
                        isModalOpen={!!selectedProduct}
                        handleOk={() => setSelectedProduct(null)}
                        handleCancel={() => setSelectedProduct(null)}
                        categories={categories}
                        listDrink={listDrink}
                        setSelectedProduct={setSelectedProduct}
                    />
                ) : (
                    <ModalFoodEdit
                        product={selectedProduct}
                        isModalOpen={!!selectedProduct}
                        handleOk={() => setSelectedProduct(null)}
                        handleCancel={() => setSelectedProduct(null)}
                        categories={categories}
                        listFood={listFood}
                        setSelectedProduct={setSelectedProduct}
                    />
                )
            )}
        </div>
    );
};

export default Product;