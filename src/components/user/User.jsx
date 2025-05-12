import React, { useState } from 'react';
import { Table, message } from 'antd';
import ModalRegister from './ModalRegister';
import { useAuth } from './../../context/AuthContext'

const User = ({ employee }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { user } = useAuth();
    console.log(user?.role === 'Owner');


    const showModal = () => {
        if (user?.role === 'Owner') {
            setIsModalOpen(true);
        } else {
            message.error('ທ່ານບໍ່ມີສິດໃນການເພີ່ມຜູ້ໃຊ້ງານໄດ້');
        }
    };

    const handleClose = () => {
        setIsModalOpen(false);
    };

    const handleSubmit = async (values) => {
        console.log('Form values:', values);
    };

    const columns = [
        { title: 'ຊື່', dataIndex: 'fname', key: 'fname' },
        { title: 'ນາມສະກຸນ', dataIndex: 'lname', key: 'lname' },
        { title: 'ເພດ', dataIndex: 'gender', key: 'gender' },
        { title: 'ເບີໂທ', dataIndex: 'phone', key: 'phone' },
        { title: 'ອີເມລ', dataIndex: 'email', key: 'email' },
        { title: 'Role', dataIndex: 'role', key: 'role' },
        {
            title: 'ຈັດການ',
            key: 'action',
            render: (_, record) => (
                <div className="flex gap-2">
                    <button
                        onClick={() => handleEdit(record)}
                        className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
                    >
                        ແກ້ໄຂ
                    </button>
                    <button
                        onClick={() => handleDelete(record)}
                        className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                    >
                        ລົບ
                    </button>
                </div>
            )
        }
    ];

    const handleEdit = (record) => {
        console.log('Edit:', record);
    };

    const handleDelete = (record) => {
        console.log('Delete:', record);
    };

    return (
        <div>
            <div className='flex items-center justify-between mb-2'>
                <h1 className='text-[20px] font-semibold'>ຂໍ້ມູນຜູ້ໃຊ້ລະບົບ</h1>

                <button
                    onClick={showModal}
                    className='h-[35px] w-[120px] font-medium rounded bg-red-500 text-center text-white border-2 border-transparent hover:border-2 hover:bg-transparent hover:border-red-500 hover:text-red-500 duration-300 cursor-pointer'>
                    ເພີ່ມຜູ້ໃຊ້ງານ
                </button>

                <ModalRegister
                    isOpen={isModalOpen}
                    onClose={handleClose}
                    onSubmit={handleSubmit}
                />
            </div>

            <div className='bg-white rounded-md p-4'>
                <Table
                    columns={columns}
                    dataSource={employee}
                    rowKey="id"
                />
            </div>
        </div>
    );
};

export default User;
