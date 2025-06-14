import React, { useEffect, useState } from 'react'
import { Table, Tag, Space, Button, message, Popconfirm, Skeleton } from 'antd';
import { BiSolidEdit } from 'react-icons/bi';
import { FaTrashAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { getUnitApi, delUnitApi } from '../../api/unit';
import useSafezoneStore from '../../store/safezoneStore';
import ModalAddUnit from './ModalAddUnit';
import { useAuth } from '../../context/AuthContext';
import Sidebar from '../sidebar/Sidebar';

const Unit = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [units, setUnits] = useState([]);
    const [loading, setLoading] = useState(true);

    const columns = [
        {
            title: <p className='text-center'>ລຳດັບ</p>,
            dataIndex: 'uid',
            key: 'uid',
            width: 50,
            render: (text) => loading ? <Skeleton.Input style={{ width: 30 }} active size="small" /> : text
        },
        {
            title: 'ຊື່ຫົວໜ່ວຍ',
            dataIndex: 'name',
            key: 'name',
            width: 300,
            render: (text) => loading ? <Skeleton.Input style={{ width: 200 }} active size="small" /> : text
        },
        {
            title: <p className='text-center'>ຈັດການ</p>,
            key: 'action',
            render: (_, record) => (
                <div className='flex items-center justify-center gap-x-2'>
                    {loading ? (
                        <>
                            <Skeleton.Button active size="small" shape="circle" />
                            <Skeleton.Button active size="small" shape="circle" />
                        </>
                    ) : (
                        <>
                            <BiSolidEdit
                                onClick={() => navigate(`/unit/${record.id}`)}
                                className='cursor-pointer text-[24px] text-blue-500'
                            />
                            <Popconfirm
                                title="ຄຳຢືນຢັນ"
                                description="ທ່ານຕ້ອງການລົບແມ່ນບໍ່ ?"
                                onConfirm={() => handleDelete(record.id)}
                                okText="Yes"
                                cancelText="No"
                            >
                                <FaTrashAlt className='cursor-pointer text-[20px] text-red-500' />
                            </Popconfirm>
                        </>
                    )}
                </div>
            ),
            width: 100,
        },
    ];

    const handleDelete = async (id) => {
        try {
            const response = await delUnitApi(user.token, id);
            if (response) {
                message.success('ລົບສຳເລັດ!!!');
                fetchUnits(); // Refresh the unit list after successful deletion
            }
        } catch (error) {
            message.error('ເກີດຂໍ້ຜິດພາດ!!!');
            console.error('Delete error:', error);
        }
    };

    const fetchUnits = async () => {
        setLoading(true);
        try {
            const response = await getUnitApi();
            if (response.data) {
                setUnits(response.data);
            }
        } catch (error) {
            message.error('ເກີດຂໍ້ຜິດພາດໃນການໂຫຼຂໍ້ມູນ!');
            console.error('Error fetching units:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUnits();
    }, []);

    const data = loading
        ? Array(5).fill({}).map((_, index) => ({
            key: `skeleton-${index}`,
            uid: <Skeleton.Input style={{ width: 30 }} active size="small" />,
            name: <Skeleton.Input style={{ width: 200 }} active size="small" />,
            action: (
                <div className='flex items-center justify-center gap-x-2'>
                    <Skeleton.Button active size="small" shape="circle" />
                    <Skeleton.Button active size="small" shape="circle" />
                </div>
            )
        }))
        : units.map(unit => ({
            key: unit.id,
            id: unit.id,
            uid: <p className='text-center'>{unit.id}</p>,
            name: <p className='text-[16px]'>{unit.name}</p>
        }));

    return (
        <Sidebar>
            <div className='p-4'>
                <ModalAddUnit onSuccess={fetchUnits} />
                <div className='flex gap-x-5 bg-white w-full p-4'>
                    <div className='bg-white rounded-md'>
                        <div className='rounded-md drop-shadow w-[500px]'>
                            <Table
                                pagination={false}
                                columns={columns}
                                dataSource={data}
                                className=''
                                loading={loading}
                            />
                        </div>
                    </div>
                    <div className='flex-1'>
                        <ul className='grid grid-cols-12 gap-4 flex-wrap'>
                            {loading ? (
                                Array(8).fill(0).map((_, index) => (
                                    <li key={index} className='col-span-3 w-[170px] h-[45px]'>
                                        <Skeleton.Button active style={{ width: '100%', height: '100%' }} />
                                    </li>
                                ))
                            ) : (
                                units.map((unitItem, index) => (
                                    <li
                                        key={index}
                                        className='cursor-pointer duration-300 hover:border-red-600 hover:text-red-600 hover:shadow-[2px_2px_5px_0px_#f56565] w-[170px] col-span-3 rounded-md drop-shadow bg-white h-[45px] flex items-center justify-center border border-gray-700 text-gray-700 font-medium'
                                    >
                                        {unitItem.name}
                                    </li>
                                ))
                            )}
                        </ul>
                    </div>
                </div>
            </div>
        </Sidebar>
    )
}

export default Unit