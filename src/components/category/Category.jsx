import React, { useEffect, useState } from 'react'
import { Button, Form, Input, Space, Table, Tag } from 'antd';
import { BiSolidEdit } from 'react-icons/bi';
import { FaTrash, FaTrashAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

import { message, Popconfirm, Modal } from 'antd';
import { useWatch } from 'antd/es/form/Form';



const Category = ({ form }) => {
    const navigate = useNavigate()
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

    const confirm = (e) => {
        console.log(e);
        message.success('ລົບສຳເລັດ!!!');
    };

    const columns = [
        {
            title: <p className=' text-center'>ໄອດີ</p>,
            dataIndex: 'cid',
            key: 'cid',
            width: 50, // เพิ่มความกว้างให้กับ cid
        },
        {
            title: 'ຊື່ປະເພດ',
            dataIndex: 'name',
            key: 'name',
            width: 300, // เพิ่มความกว้างให้กับ name
        },
        {
            title: <p className=' text-center'>ຈັດການ</p>,
            key: 'action',
            render: (_, record) => (
                <div className=' flex items-center justify-center gap-x-2'>
                    <BiSolidEdit onClick={() => navigate(`/category/${1}`)}
                        className=' cursor-pointer text-[24px] text-blue-500' />
                    <Popconfirm
                        title="ຄຳຢືນຢັນ"
                        description="ທ່ານຕ້ອງການລົບແມ່ນບໍ່ ?"
                        onConfirm={confirm}
                        // onCancel={cancel}
                        okText="Yes"
                        cancelText="No"
                    >
                        <FaTrashAlt className=' cursor-pointer text-[20px] text-red-500' />
                    </Popconfirm>
                </div>
            ),
            width: 100, // เพิ่มความกว้างให้กับ action
        },
    ];
    const data = [
        {
            cid: <p className=' text-center'>1</p>,
            name: <p className=' text-[16px]'>ທອດ</p>
        },
        {
            cid: <p className=' text-center'>2</p>,
            name: <p className=' text-[16px]'>ແກງ</p>
        },
        {
            cid: <p className=' text-center'>3</p>,
            name: <p className=' text-[16px]'>ຜັດ</p>
        },
        {
            cid: <p className=' text-center'>4</p>,
            name: <p className=' text-[16px]'>ເຄື່ອງດື່ມທຳມະດາ</p>
        },
        {
            cid: <p className=' text-center'>5</p>,
            name: <p className=' text-[16px]'>ເຄື່ອງດື່ມແອລກໍຮໍ</p>
        },
    ];
    return (
        <div className=''>
            <div className='mb-2 flex items-center justify-between'>
                <h1 className=' text-[18px] font-medium'>ປະເພດອາຫານ ແລະ ເຄື່ອງດື່ມ</h1>
                <button onClick={showModal}
                    className='h-[35px] w-[120px] rounded bg-red-500 text-center text-white border-2 border-transparent hover:border-2 hover:bg-transparent hover:border-red-500 hover:text-red-500 duration-300 cursor-pointer'>
                    ເພີ່ມປະເພດ
                </button>
                <Modal footer={null} open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
                    <h1 className=' text-center text-[18px] font-medium mb-5'>
                        ເພີ່ມປະເພດອາຫານ - ເຄື່ອງດື່ມ
                    </h1>
                    <Form name="validateOnly" layout="vertical" autoComplete="off">
                        <Form.Item
                            name="name"
                            label="ຊື່ປະເພດ"
                            rules={[
                                {
                                    required: true,
                                },
                            ]}
                        >
                            <Input />
                        </Form.Item>
                    </Form>
                    <div className=' flex justify-center items-center gap-x-4 mt-5'>
                        <button onClick={handleCancel}
                            className=' bg-red-500 text-white w-[70px] py-1 rounded border-1 border-transparent hover:border-1 hover:bg-transparent hover:border-red-500 hover:text-red-500 duration-300 cursor-pointer'>
                            ຍົກເລີກ
                        </button>
                        <button onClick={handleCancel}
                            className=' bg-blue-500 text-white w-[70px] py-1 rounded border-1 border-transparent hover:border-1 hover:bg-transparent hover:border-blue-500 hover:text-blue-500 duration-300 cursor-pointer'>
                            ບັນທຶກ
                        </button>
                    </div>
                </Modal>
            </div>
            <div className=' flex gap-x-5 bg-white w-full  p-4 h-screen'>
                <div className=' bg-white rounded-md'>
                    <div className=' rounded-md drop-shadow w-[500px]'>
                        <Table pagination={false} columns={columns} dataSource={data} className='' />
                    </div>
                </div>
                <div className=' flex-1'>
                    <ul className=' grid grid-cols-12 gap-4 flex-wrap'>
                        {/* <li className=' w-[140px] rounded-md drop-shadow bg-white h-[45px] flex items-center justify-center border border-red-700 text-red-700 font-medium'>
                            ເຄື່ອງດື່ມທຳມະດາ
                        </li> */}
                        <li className=' w-[170px] col-span-3 rounded-md drop-shadow bg-white h-[45px] flex items-center justify-center border border-gray-700 text-gray-700 font-medium'>
                            ເຄື່ອງດື່ມທຳມະດາ
                        </li>
                        <li className=' w-[170px] col-span-3 rounded-md drop-shadow bg-white h-[45px] flex items-center justify-center border border-gray-700 text-gray-700 font-medium'>
                            ເຄື່ອງດື່ມແອລກໍຮໍ
                        </li>
                        <li className=' w-[170px] col-span-3 rounded-md drop-shadow bg-white h-[45px] flex items-center justify-center border border-gray-700 text-gray-700 font-medium'>
                            ທອດ
                        </li>
                        <li className=' w-[170px] col-span-3 rounded-md drop-shadow bg-white h-[45px] flex items-center justify-center border border-gray-700 text-gray-700 font-medium'>
                            ຂອງຫວານ
                        </li>
                        <li className=' w-[170px] col-span-3 rounded-md drop-shadow bg-white h-[45px] flex items-center justify-center border border-gray-700 text-gray-700 font-medium'>
                            ຜັດ
                        </li>
                        <li className=' w-[170px] col-span-3 rounded-md drop-shadow bg-white h-[45px] flex items-center justify-center border border-gray-700 text-gray-700 font-medium'>
                            ຕຳ
                        </li>
                        <li className=' w-[170px] col-span-3 rounded-md drop-shadow bg-white h-[45px] flex items-center justify-center border border-gray-700 text-gray-700 font-medium'>
                            ຍຳ
                        </li>
                        <li className=' w-[170px] col-span-3 rounded-md drop-shadow bg-white h-[45px] flex items-center justify-center border border-gray-700 text-gray-700 font-medium'>
                            ແກງ
                        </li>
                    </ul>
                </div>
            </div>
        </div >
    )
}

export default Category