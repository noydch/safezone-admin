
import React, { useState } from 'react'
import { categoryData, categoryData2, productData } from '../../../dataStore'

import food from '../../assets/food.webp'
import { message, Popconfirm, Modal, Form, Input, Upload, Select } from 'antd'
import { CloudUploadOutlined, UploadOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import { Button } from 'rsuite'
import UploadFileAdd from './UploadFileAdd'
import ModalProductEdit from './ModalProductEdit'

const Product = () => {
    const [isSelected, setIsSelected] = useState('ທັງໝົດ')
    const navigate = useNavigate()
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [image, setImage] = useState();
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
        <div className=' p-2 bg-white rounded-md'>
            <ul className='p-2 grid grid-cols-12 place-items-center gap-4 overflow-x-auto'>
                {
                    categoryData2.map((categoryItem, index) => (
                        <li onClick={() => setIsSelected(categoryItem.categoryName)}
                            key={index} className={`${isSelected === categoryItem.categoryName ? 'text-red-500 border-2 border-red-500 hover:text-red-600 shadow-[2px_2px_5px_0px_#f56565]' : ''} cursor-pointer duration-300 hover:border-red-600 hover:text-red-600 hover:shadow-[2px_2px_5px_0px_#f56565] 
                        w-[200px] col-span-2 rounded-md drop-shadow bg-white h-[45px] flex items-center justify-center border border-gray-700 text-gray-700 font-medium`}>
                            {categoryItem.categoryName}
                        </li>
                    ))
                }
            </ul>

            <hr className=' border border-white my-3' />

            <div className=' '>
                <div className=' flex justify-end my-2'>
                    <button onClick={showModal}
                        className='h-[35px] w-[120px] rounded bg-red-500 text-center text-white border-2 border-transparent hover:border-2 hover:bg-transparent hover:border-red-500 hover:text-red-500 duration-300 cursor-pointer'>
                        ເພີ່ມປະເພດ
                    </button>
                    <Modal footer={null} open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
                        <h1 className=' text-center text-[20px] font-semibold mb-5'>
                            ເພີ່ມອາຫານ - ເຄື່ອງດື່ມ
                        </h1>
                        <form action=""
                            className='flex gap-2 w-full h-[240px]'
                        >
                            <div className=' flex-1 h-full flex justify-center items-center'>
                                <UploadFileAdd image={image} setImage={setImage} />
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
                <ul className=' grid grid-cols-5 place-items-center gap-4'>
                    {
                        productData
                            .filter(productItem => isSelected === 'ທັງໝົດ' || productItem.categoryName === isSelected)
                            .map((productItem, index) => (
                                <li key={index} className={` flex flex-col items-center w-[230px] h-[260px] p-2 border border-gray-200 drop-shadow-md rounded-md bg-white`}>
                                    <div className=' w-[220px] h-[160px] rounded-md'>
                                        <img src={productItem.picture} alt=""
                                            className=' w-[220px] h-[160px] rounded-md object-cover'
                                        />
                                    </div>
                                    <div className=' mt-2 w-full flex flex-col h-full'>
                                        <div className=' flex-1'>
                                            <div className=' flex items-end justify-between'>
                                                <p className=' text-[16px] font-medium'>
                                                    {productItem.pName}
                                                </p>
                                                <h4 className=' text-[18px] font-semibold text-red-500'>{(productItem.price).toLocaleString()} ກີບ</h4>
                                            </div>
                                        </div>
                                        <div className=' flex items-end justify-between'>
                                            <span className=' text-[12px]'>20/05/2024</span>
                                            <div className=' flex items-center gap-x-2'>
                                                <ModalProductEdit />
                                                <Popconfirm
                                                    title="ຄຳຢືນຢັນ"
                                                    description="ເຈົ້າຕ້ອງການລົບລາຍການນີ້ບໍ່ ?"
                                                    okText="ຢືນຢັນ"
                                                    cancelText="ຍົກເລີກ"
                                                    onConfirm={(index) => message.success(`ລົບ ${productItem.pName} ສຳເລັດ`)}
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
                </ul>
            </div >
        </div >
    )
}

export default Product