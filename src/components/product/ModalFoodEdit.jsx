import React, { useState, useEffect } from 'react'
import { Modal, Select, message } from 'antd'
import UploadFileAdd from './UploadFileAdd'
import { updateFoodApi } from '../../api/product'
import { LiaSpinnerSolid } from 'react-icons/lia'
import { useAuth } from '../../context/AuthContext'

const ModalFoodEdit = ({ product, isModalOpen, handleOk, handleCancel, categories, listFood, setSelectedProduct }) => {
    const { user } = useAuth()
    const token = localStorage.getItem('token')
    const [loading, setLoading] = useState(false)
    const [form, setForm] = useState({
        name: product?.name || '',
        categoryId: product?.categoryId || 'ເລືອກປະເພດ',
        price: product?.price || 0,
        image: product?.imageUrl ? [{ url: product.imageUrl }] : ''
    })

    useEffect(() => {
        if (isModalOpen && product) {
            setForm({
                name: product.name || '',
                categoryId: product.categoryId || 'ເລືອກປະເພດ',
                price: product.price || 0,
                image: product.imageUrl ? [{ url: product.imageUrl }] : ''
            })
        }
    }, [isModalOpen, product])

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.name || form.categoryId === 'ເລືອກປະເພດ' || !form.price || !form.image) {
            message.error('ກະລຸນາປ້ອນຂໍ້ມູນໃຫ້ຄົບຖ້ວນ');
            return;
        }
        setLoading(true)
        try {
            const formData = {
                ...form,
                price: Number(form.price) || 0,
            };
            const response = await updateFoodApi(token, product.id, formData)
            if (response) {
                message.success("ແກ້ໄຂອາຫານສຳເລັດ!!!")
                listFood()
                setSelectedProduct(null)
                handleCancel()
            }
        } catch (error) {
            console.log(error);
            message.error('ເກີດຂໍ້ຜິດພາດໃນການແກ້ໄຂອາຫານ');
        } finally {
            setLoading(false)
        }
    }

    const handleEdit = () => {
        if (user?.role === 'Owner' || user?.role === 'Manager') {
            setSelectedProduct(product);
        } else {
            message.error('ທ່ານບໍ່ມີສິດໃນການແກ້ໄຂ');
        }
    };

    return (
        <>
            <button
                onClick={handleEdit}
                disabled={!(user?.role === 'Owner' || user?.role === 'Manager')}
                className={`text-[12px] text-white w-[50px] py-0.5 rounded border-1 border-transparent duration-300 cursor-pointer ${(user?.role === 'Owner' || user?.role === 'Manager')
                    ? 'bg-blue-500 hover:border-1 hover:bg-transparent hover:border-blue-500 hover:text-blue-500'
                    : 'bg-gray-400 cursor-not-allowed'
                    }`}
            >
                ແກ້ໄຂ
            </button>
            <Modal footer={null} open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
                <h1 className=' text-center text-[20px] font-semibold mb-5'>
                    ແກ້ໄຂອາຫານ
                </h1>
                <form action="" onSubmit={handleSubmit}
                    className='flex gap-2 w-full h-[240px]'
                >
                    <div className=' flex-1 h-full flex justify-center items-center'>
                        <UploadFileAdd form={form} setForm={setForm} />
                    </div>
                    <div className=' flex-1 w-full flex flex-col gap-2'>
                        <div>
                            <label htmlFor="name" className=' block'>ຊື່:</label>
                            <input type="text"
                                value={form.name}
                                onChange={handleChange}
                                name='name'
                                className='w-full px-2 pt-1 pb-0.5 placeholder:text-[12px] text-[14px] outline-none border-gray-300 border bg-white rounded'
                                placeholder='ກະລຸນາປ້ອນຊື່ອາຫານ...'
                            />
                        </div>
                        <div>
                            <label htmlFor="categoryId" className=' block'>ປະເພດ:</label>
                            <Select
                                labelInValue
                                name='categoryId'
                                value={form.categoryId && form.categoryId !== 'ເລືອກປະເພດ' ? {
                                    value: form.categoryId,
                                    label: categories.find(c => c.id === form.categoryId)?.name || form.categoryId
                                } : undefined}
                                placeholder="ເລືອກປະເພດ"
                                className='w-full'
                                style={{ width: '100%' }}
                                onChange={(value) => {
                                    setForm({
                                        ...form,
                                        categoryId: value.value
                                    });
                                }}
                                options={
                                    categories.filter(category => !category.name.includes('ເຄື່ອງດື່ມ'))
                                        .map((category) => ({
                                            value: category.id,
                                            label: category.name
                                        }))
                                }
                                allowClear
                            />
                        </div>
                        <div>
                            <label htmlFor="price" className=' block'>ລາຄາ:</label>
                            <input type="number"
                                name='price'
                                onChange={handleChange}
                                value={form.price || ''}
                                className='w-full px-2 pt-1 pb-0.5 placeholder:text-[12px] text-[14px] outline-none border-gray-300 border bg-white rounded'
                                placeholder='ກະລຸນາປ້ອນລາຄາ...'
                                min="0"
                            />
                        </div>
                    </div>
                </form>
                <div className=' flex justify-center items-center gap-x-4 mt-5'>
                    <button onClick={handleCancel}
                        type="button"
                        className=' bg-red-500 text-white w-[70px] py-1 rounded border-1 border-transparent hover:border-1 hover:bg-transparent hover:border-red-500 hover:text-red-500 duration-300 cursor-pointer'>
                        ຍົກເລີກ
                    </button>
                    <button onClick={handleSubmit}
                        type="button"
                        disabled={loading}
                        className=' bg-blue-500 text-white w-[100px] flex items-center justify-center py-1 rounded border-1 border-transparent hover:border-1 hover:bg-transparent hover:border-blue-500 hover:text-blue-500 duration-300 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed'>
                        {
                            loading ? <p className=' flex items-center gap-x-1.5'>
                                <span className=''>ກຳລັງບັນທຶກ</span>
                                <LiaSpinnerSolid className=' animate-spin text-[20px]' />
                            </p> :
                                "ບັນທຶກ"
                        }
                    </button>
                </div>
            </Modal>
        </>
    )
}

export default ModalFoodEdit 