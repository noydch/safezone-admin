import React, { useEffect, useState } from 'react'
import { Button, Form, Input, Space, Table, Tag } from 'antd';
import { BiSolidEdit } from 'react-icons/bi';
import { FaTrash, FaTrashAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

import { message, Popconfirm, Modal } from 'antd';
import { useWatch } from 'antd/es/form/Form';

import { categoryData } from '../../../dataStore';
import useSafezoneStore from '../../store/safezoneStore';
import { delCategoryApi } from '../../api/category';
import ModalAdd from './ModalAdd';

const Category = ({ form }) => {
    const navigate = useNavigate()
    const token = localStorage.getItem('token')
    const categories = useSafezoneStore((state) => state.categories)
    const listCategory = useSafezoneStore((state) => state.listCategory)
    console.log(categories);

    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        listCategory()
    }, [])



    const handleOk = async (id) => {
        try {
            const response = await delCategoryApi(token, id);
            if (response) {
                message.success('ລົບສຳເລັດ!!!');
                listCategory(); // Refresh the category list after successful deletion
            }
        } catch (error) {
            message.error('ເກີດຂໍ້ຜິດພາດ!!!');
            console.error('Delete error:', error);
        }
        setIsModalOpen(false);
    };



    const confirm = (id) => {
        handleOk(id);
    };


    const columns = [
        {
            title: <p className='text-center'>ລຳດັບ</p>,
            dataIndex: 'cid',
            key: 'cid',
            width: 50,
        },
        {
            title: 'ຊື່ປະເພດ',
            dataIndex: 'name',
            key: 'name',
            width: 300,
        },
        {
            title: <p className='text-center'>ຈັດການ</p>,
            key: 'action',
            render: (_, record) => (
                <div className='flex items-center justify-center gap-x-2'>
                    <BiSolidEdit
                        onClick={() => navigate(`/category/${record.id}`)}
                        className='cursor-pointer text-[24px] text-blue-500'
                    />
                    <Popconfirm
                        title="ຄຳຢືນຢັນ"
                        description="ທ່ານຕ້ອງການລົບແມ່ນບໍ່ ?"
                        onConfirm={() => confirm(record.id)}
                        okText="Yes"
                        cancelText="No"
                    >
                        <FaTrashAlt className='cursor-pointer text-[20px] text-red-500' />
                    </Popconfirm>
                </div>
            ),
            width: 100,
        },
    ];

    const data = categories.map(category => ({
        id: category.id,
        cid: <p className='text-center'>{category.id}</p>,
        name: <p className='text-[16px]'>{category.name}</p>
    }));

    return (
        <div className=''>
            <ModalAdd token={token} />
            <div className='flex gap-x-5 bg-white w-full p-4 h-screen'>
                <div className='bg-white rounded-md'>
                    <div className='rounded-md drop-shadow w-[500px]'>
                        <Table pagination={false} columns={columns} dataSource={data} className='' />
                    </div>
                </div>
                <div className='flex-1'>
                    <ul className='grid grid-cols-12 gap-4 flex-wrap'>
                        {categories.map((categoryItem, index) => (
                            <li
                                key={index}
                                className='cursor-pointer duration-300 hover:border-red-600 hover:text-red-600 hover:shadow-[2px_2px_5px_0px_#f56565] w-[170px] col-span-3 rounded-md drop-shadow bg-white h-[45px] flex items-center justify-center border border-gray-700 text-gray-700 font-medium'
                            >
                                {categoryItem.name}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    )
}

export default Category