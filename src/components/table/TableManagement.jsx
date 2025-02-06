import { message, Modal, Popconfirm } from 'antd'
import React, { useState } from 'react'
import { MdTableBar } from 'react-icons/md'

const TableManagement = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);

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
        <div className=' h-screen'>
            <div className=' flex items-end justify-between'>
                <h1 className=' text-[18px] font-medium'>ລາຍການໂຕະ</h1>
                <button onClick={showModal}
                    className='h-[35px] w-[100px] rounded bg-red-500 text-center text-white border-2 border-transparent hover:border-2 hover:bg-transparent hover:border-red-500 hover:text-red-500 duration-300 cursor-pointer'>
                    ເພີ່ມໂຕະ
                </button>
                <Modal footer={null} open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
                    <h1 className=' text-center text-[20px] font-semibold mb-5'>
                        ເພີ່ມອາຫານ - ເຄື່ອງດື່ມ
                    </h1>
                    {/* <form action=""
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
                        </div> */}
                </Modal>
            </div>
            <div className=' bg-white p-4 h-full mt-2 rounded-md'>
                <ul className=' grid grid-cols-6 gap-3 place-items-center'>
                    {Array.from({ length: 24 }).map((_, index) => (
                        <li key={index} className=' flex flex-col justify-between w-[190px] h-[110px] p-2 bg-white drop-shadow-md border border-gray-200 rounded-md'>
                            <div className=' flex justify-between'>
                                <MdTableBar className=' text-[64px]' />
                                <h2 className='text-[24px] font-medium'>ໂຕະທີ {index + 1}</h2>
                            </div>
                            <div className=' flex justify-between items-end'>
                                <span className=' text-[10px] text-gray-500'>01/02/2025</span>
                                <div className=' flex items-center gap-x-2'>
                                    <button
                                        className=' bg-blue-500 text-[12px] text-white w-[50px] py-0.5 rounded border-1 border-transparent hover:border-1 hover:bg-transparent hover:border-blue-500 hover:text-blue-500 duration-300 cursor-pointer'>
                                        ແກ້ໄຂ
                                    </button>
                                    <Popconfirm
                                        title="ຄຳຢືນຢັນ"
                                        description="ເຈົ້າຕ້ອງການລົບລາຍການນີ້ບໍ່ ?"
                                        okText="ຢືນຢັນ"
                                        cancelText="ຍົກເລີກ"
                                        onConfirm={() => message.success(`ລົບໂຕະທີ ${index} ສຳເລັດ!!!`)}>
                                        <button
                                            className=' bg-red-500 text-[12px] text-white w-[50px] py-0.5 rounded border-1 border-transparent hover:border-1 hover:bg-transparent hover:border-red-500 hover:text-red-500 duration-300 cursor-pointer'>
                                            ລົບ
                                        </button>
                                    </Popconfirm>
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    )
}

export default TableManagement