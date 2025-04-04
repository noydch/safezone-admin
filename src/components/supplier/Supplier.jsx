import React, { useState, useEffect, useCallback } from 'react';
import { Table, Button, Space, Spin, Alert } from 'antd';
import axios from 'axios';
import ApiPath from '../../api/apiPath'; // Adjust path if necessary
import EditSupplier from './EditSupplier'; // Import EditSupplier
import DeleteSupplier from './DeleteSupplier'; // Import DeleteSupplier
import CreateSupplier from './CreateSupplier'; // Import CreateSupplier

const Supplier = () => {
    const [suppliers, setSuppliers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isEditModalVisible, setIsEditModalVisible] = useState(false);
    const [editingSupplierId, setEditingSupplierId] = useState(null);
    const [isCreateModalVisible, setIsCreateModalVisible] = useState(false); // State for create modal

    // Fetch suppliers
    const fetchSuppliers = useCallback(async () => {
        // Only set loading to true if not triggered by modal actions
        // setLoading(true); 
        setError(null);
        try {
            // Use getSuppliers endpoint
            const response = await axios.get(ApiPath.getSuppliers);
            const dataWithKeys = response.data.map(supplier => ({ ...supplier, key: supplier.id }));
            setSuppliers(dataWithKeys);
        } catch (err) {
            console.error("Error fetching suppliers:", err);
            setError('Failed to load suppliers. Please try again later.');
        } finally {
            // Ensure loading is set to false after fetch completes
            setLoading(false); 
        }
    }, []);

    useEffect(() => {
        setLoading(true); // Set initial loading state
        fetchSuppliers();
    }, [fetchSuppliers]);

    // Define columns for the table
    const columns = [
        {
            title: 'ລຳດັບ',
            key: 'index',
            width: '5%',
            render: (_, __, index) => index + 1,
        },
        {
            title: 'ຊື່ຜູ້ສະໜອງ',
            dataIndex: 'name',
            key: 'name',
            width: '25%',
        },
        {
            title: 'ທີ່ຢູ່',
            dataIndex: 'address',
            key: 'address',
            width: '30%',
        },
        {
            title: 'ເບີໂທ',
            dataIndex: 'phone',
            key: 'phone',
            width: '15%',
        },
        {
            title: 'ອີເມລ',
            dataIndex: 'email',
            key: 'email',
            width: '15%',
        },
        {
            title: 'ຈັດການ',
            key: 'action',
            width: '10%',
            render: (_, record) => (
                <Space size="small"> {/* Adjusted size */}
                    <Button type="primary" onClick={() => handleEdit(record.id)}>
                        ແກ້ໄຂ
                    </Button>
                    <DeleteSupplier
                        supplierId={record.id}
                        supplierName={record.name}
                        onSupplierDeleted={fetchSuppliers} // Refresh data on delete
                    />
                </Space>
            ),
        },
    ];

    // Handlers for Edit Modal
    const handleEdit = (supplierId) => {
        setEditingSupplierId(supplierId);
        setIsEditModalVisible(true);
    };

    const handleCloseEditModal = () => {
        setIsEditModalVisible(false);
        setEditingSupplierId(null);
    };

    const handleSupplierUpdated = () => {
        fetchSuppliers(); // Refresh data after update
    };

    // Handlers for Create Modal
    const handleOpenCreateModal = () => {
        setIsCreateModalVisible(true);
    };

    const handleCloseCreateModal = () => {
        setIsCreateModalVisible(false);
    };

    const handleSupplierCreated = () => {
        fetchSuppliers(); // Refresh data after creation
    };

    // Adjust loading state condition slightly
    if (loading && suppliers.length === 0) {
        return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}><Spin size="large" /></div>;
    }

    if (error) {
        return <Alert message="Error" description={error} type="error" showIcon />;
    }

    return (
        <div>
            <h1 className='text-[20px] font-semibold mb-2'>ຂໍ້ມູນຜູ້ສະໜອງ</h1>
            <div className=' bg-white p-4 rounded-md '>
                <div className="mb-4 text-right">
                    {/* Add button to open the create modal */}
                    <Button type="primary" onClick={handleOpenCreateModal}>
                        ເພີ່ມຜູ້ສະໜອງໃໝ່
                    </Button>
                </div>
                <div> {/* Removed max-width constraint */}
                    <Table
                        dataSource={suppliers}
                        columns={columns}
                        loading={loading} // Use the loading state directly from fetchSuppliers
                        scroll={{ x: 1000 }} // Enable horizontal scroll if needed
                    />
                </div>
            </div>

            {/* Edit Supplier Modal */}
            <EditSupplier
                visible={isEditModalVisible}
                supplierId={editingSupplierId}
                onClose={handleCloseEditModal}
                onSupplierUpdated={handleSupplierUpdated}
            />
            
            {/* Create Supplier Modal */}
            <CreateSupplier 
                visible={isCreateModalVisible}
                onClose={handleCloseCreateModal}
                onSupplierCreated={handleSupplierCreated}
            />
        </div>
    );
};

// Export Supplier correctly
export default Supplier; 
