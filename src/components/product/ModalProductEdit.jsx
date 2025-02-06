import { Modal, Select } from 'antd';
import React, { useState } from 'react'
import UploadFileAdd from './UploadFileAdd';
import { useNavigate } from 'react-router-dom';
import UploadFileEdit from './UploadFileEdit';

const ModalProductEdit = () => {
    const [isSelected, setIsSelected] = useState('ທັງໝົດ')
    const navigate = useNavigate()
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [imageEdit, setImageEdit] = useState();
    const [pName, setPName] = useState('');
    const [categoryId, setCategoryId] = useState('ເລືອກປະເພດ');
    const [quantity, setQuantity] = useState(0);
    const [price, setPrice] = useState(0);


    const handleChange = (e) => {
        console.log(e.target.name + " : " + e.target.value);
        switch (e.target.name) {
            case 'name':
                setPName(e.target.value);
                break;
            case 'quantity':
                setQuantity(e.target.value);
                break;
            case 'price':
                setPrice(e.target.value);
                break;
            default:
                break;
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log({ pName, categoryId, quantity, price }); // รวมค่าที่แยกกัน
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
    return (
        <div>
            <button onClick={showModal}
                className=' bg-blue-500 text-[12px] text-white w-[50px] py-0.5 rounded border-1 border-transparent hover:border-1 hover:bg-transparent hover:border-blue-500 hover:text-blue-500 duration-300 cursor-pointer'>
                ແກ້ໄຂ
            </button>
            <Modal footer={null} open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
                <h1 className=' text-center text-[20px] font-semibold mb-5'>
                    ແກ້ໄຂອາຫານ - ເຄື່ອງດື່ມ
                </h1>
                <form action=""
                    className='flex gap-2 w-full h-[240px]'
                >
                    <div className=' flex-1 h-full flex justify-center items-center'>
                        <UploadFileEdit imageEdit={imageEdit} setImageEdit={setImageEdit} />
                    </div>
                    <div className=' flex-1 w-full flex flex-col gap-2'>
                        <div>
                            <label htmlFor="name" className=' block'>ຊື່:</label>
                            <input type="text"
                                value={pName}
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
                                value={{ value: categoryId }} // เปลี่ยนจาก value={frmAddProduct.categoryId}
                                className='w-full text-gray-300'
                                onChange={(value) => {
                                    setCategoryId(value.value); // ปรับการจัดการค่า
                                }}
                                options={[
                                    {
                                        value: 1,
                                        label: 'ເຄື່ອງດື່ມ',
                                    },
                                    {
                                        value: 2,
                                        label: 'ທອດ',
                                    },
                                    {
                                        value: 3,
                                        label: 'ຕຳ',
                                    },
                                ]}
                            />
                        </div>
                        <div>
                            <label htmlFor="quantity" className=' block'>ຈຳນວນ:</label>
                            <input type="text"
                                name='quantity'
                                onChange={handleChange}
                                value={quantity}
                                className='w-full px-2 pt-1 pb-0.5 placeholder:text-[12px] text-[14px] outline-none border-gray-300 border bg-white rounded'
                                placeholder='ກະລຸນາປ້ອນຈຳນວນ...'
                            />
                        </div>
                        <div>
                            <label htmlFor="price" className=' block'>ລາຄາ:</label>
                            <input type="text"
                                name='price'
                                onChange={handleChange}
                                value={price}
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
                        className=' bg-blue-500 text-white w-[70px] py-1 rounded border-1 border-transparent hover:border-1 hover:bg-transparent hover:border-blue-500 hover:text-blue-500 duration-300 cursor-pointer'>
                        ບັນທຶກ
                    </button>
                </div>
            </Modal>
        </div>
    )
}

export default ModalProductEdit