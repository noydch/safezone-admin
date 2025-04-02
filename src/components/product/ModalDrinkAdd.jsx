import React, { useState } from 'react'
import { Modal, Select, message } from 'antd'
import UploadFileAdd from './UploadFileAdd'
import { insertDrinkApi } from '../../api/product'
import useSafezoneStore from '../../store/safezoneStore'
import { LiaSpinnerSolid } from 'react-icons/lia'

const ModalDrinkAdd = ({ form, setForm, categories, listFood }) => {
    const token = localStorage.getItem('token')
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(false)
    const listDrink = useSafezoneStore((state) => state.listDrink)

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    }
    const showModal = () => {
        setIsModalOpen(true);
    };
    const handleOk = () => {
        setIsModalOpen(false);
    };
    const handleCancel = () => {
        setIsModalOpen(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true)
        try {
            const response = await insertDrinkApi(token, form)
            if (response) {
                message.success("ເພີ່ມອາຫານສຳເລັດ!!!")
                listDrink()
                setForm({
                    name: '',
                    categoryId: '',
                    price: '',
                    image: null
                })
                handleCancel()
                setLoading(false)
            }
        } catch (error) {
            console.log(error);
            setLoading(false)
        }
    }

    return (
        <div>
            <button onClick={showModal}
                className='h-[35px] w-[120px] rounded bg-red-500 text-center text-white border-2 border-transparent hover:border-2 hover:bg-transparent hover:border-red-500 hover:text-red-500 duration-300 cursor-pointer'>
                ເພີ່ມເຄື່ອງດື່ມ
            </button>
            <Modal footer={null} open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
                <h1 className=' text-center text-[20px] font-semibold mb-5'>
                    ເພີ່ມເຄື່ອງດື່ມ
                </h1>
                <form action=""
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
                            <label htmlFor="categoryId" className=' block'>ປະເພດອາຫານ:</label>
                            <Select
                                labelInValue
                                name='categoryId'
                                value={form.categoryId ? { value: form.categoryId } : undefined}
                                placeholder="ເລືອກປະເພດ"
                                className='w-full text-gray-300'
                                onChange={(value) => {
                                    setForm({
                                        ...form,
                                        categoryId: value.value
                                    });
                                }}
                                options={
                                    categories.map((category) => ({
                                        value: category.id,
                                        label: category.name
                                    }))
                                }
                            />
                        </div>
                        {/* <div>
                            <label htmlFor="qty" className=' block'>ຈຳນວນ:</label>
                            <input type="text"
                                name='qty'
                                onChange={handleChange}
                                value={form.qty}
                                className='w-full px-2 pt-1 pb-0.5 placeholder:text-[12px] text-[14px] outline-none border-gray-300 border bg-white rounded'
                                placeholder='ກະລຸນາປ້ອນຈຳນວນ...'
                            />
                        </div> */}
                        <div>
                            <label htmlFor="price" className=' block'>ລາຄາ:</label>
                            <input type="text"
                                name='price'
                                onChange={handleChange}
                                value={form.price}
                                className='w-full px-2 pt-1 pb-0.5 placeholder:text-[12px] text-[14px] outline-none border-gray-300 border bg-white rounded'
                                placeholder='ກະລຸນາປ້ອນລາຄາ...'
                            />
                        </div>
                    </div>
                </form>
                <div className=' flex justify-center items-center gap-x-4 mt-5'>
                    <button onClick={handleCancel}
                        className=' bg-red-500 text-white w-[70px] py-1 rounded border-1 border-transparent hover:border-1 hover:bg-transparent hover:border-red-500 hover:text-red-500 duration-300 cursor-pointer'>
                        ຍົກເລີກ
                    </button>
                    <button type='submit' onClick={handleSubmit}
                        className=' bg-blue-500 text-white w-[100px] flex items-center justify-center py-1 rounded border-1 border-transparent hover:border-1 hover:bg-transparent hover:border-blue-500 hover:text-blue-500 duration-300 cursor-pointer'>
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
        </div>
    )
}

export default ModalDrinkAdd