import React, { useState, useEffect } from 'react';
import { Table, message, Popconfirm } from 'antd';
import Sidebar from '../sidebar/Sidebar'
import ModalAddProductUnit from './ModalAddProductUnit'
import { getAllProductUnitApi, deleteProductUnitApi } from '../../api/productUnit';
import { useAuth } from '../../context/AuthContext';
import useSafezoneStore from '../../store/safezoneStore';
import ModalEditProductUnit from './ModalEditProductUnit';

const ProductUnit = () => {
    const [productUnits, setProductUnits] = useState([]);
    const { user } = useAuth();
    const token = useSafezoneStore((state) => state.token)
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedRecord, setSelectedRecord] = useState(null);

    // Function to fetch product units
    const fetchProductUnits = async () => {
        try {
            const response = await getAllProductUnitApi(token);
            setProductUnits(response.data);
        } catch (error) {
            message.error('Failed to fetch product units');
        }
    };

    // Fetch product units on component mount
    useEffect(() => {
        fetchProductUnits();
    }, []);

    const handleSuccess = () => {
        fetchProductUnits(); // Refresh data after adding new unit
    };

    const handleEdit = (record) => {
        if (user?.role === 'Owner' || user?.role === 'Manager') {
            setSelectedRecord(record);
            setIsEditModalOpen(true);
        } else {
            message.error('ທ່ານບໍ່ມີສິດໃນການແກ້ໄຂຫົວໜ່ວຍສິນຄ້າໄດ້');
        }
    };

    const handleDelete = async (record) => {
        if (user?.role === 'Owner' || user?.role === 'Manager') {
            try {
                await deleteProductUnitApi(token, record.id);
                message.success('ລົບຫົວໜ່ວຍສຳເລັດ');
                fetchProductUnits(); // Refresh the list after deletion
            } catch (error) {
                console.error('Error deleting product unit:', error);
                message.error('ເກີດຂໍ້ຜິດພາດໃນການລົບຫົວໜ່ວຍ');
            }
        } else {
            message.error('ທ່ານບໍ່ມີສິດໃນການລົບຫົວໜ່ວຍສິນຄ້າໄດ້');
        }
    };

    const columns = [
        {
            title: 'ຊື່ຫົວໜ່ວຍ',
            dataIndex: 'name',
            key: 'name'
        },
        {
            title: 'ລາຄາ',
            dataIndex: 'price',
            key: 'price',
            render: (price) => `${price.toLocaleString()} ກີບ`
        },
        {
            title: 'ID ເຄື່ອງດື່ມ',
            dataIndex: 'drinkId',
            key: 'drinkId'
        },
        {
            title: 'ຈຳນວນພື້ນຖານ',
            dataIndex: 'baseItemsCount',
            key: 'baseItemsCount'
        },
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
                    <Popconfirm
                        title="ຢືນຢັນການລົບ"
                        description={`ທ່ານແນ່ໃຈບໍ່ວ່າຕ້ອງການລົບຫົວໜ່ວຍ ${record.name}?`}
                        onConfirm={() => handleDelete(record)}
                        okText="ຢືນຢັນ"
                        cancelText="ຍົກເລີກ"
                    >
                        <button
                            className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                        >
                            ລົບ
                        </button>
                    </Popconfirm>
                </div>
            )
        }
    ];

    return (
        <Sidebar>
            <ModalAddProductUnit onSuccess={handleSuccess} />

            <ModalEditProductUnit
                isModalOpen={isEditModalOpen}
                setIsModalOpen={setIsEditModalOpen}
                record={selectedRecord}
                onSuccess={handleSuccess}
            />

            <div className='bg-white rounded-md p-4 mt-4'>
                <Table
                    columns={columns}
                    dataSource={productUnits}
                    rowKey="id"
                />
            </div>
        </Sidebar>
    )
}

export default ProductUnit