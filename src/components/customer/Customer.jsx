import React, { useState, useEffect, useCallback } from 'react';
import { Table, Button, Space, Spin, Alert, message } from 'antd';
import axios from 'axios';
import ApiPath from '../../api/apiPath';
import EditCustomer from './EditCustomer';
import DeleteCustomer from './DeleteCustomer';

const Customer = () => {
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isEditModalVisible, setIsEditModalVisible] = useState(false);
    const [editingCustomerId, setEditingCustomerId] = useState(null);

    const fetchCustomers = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get(ApiPath.getCustomers);
            const dataWithKeys = response.data.map(customer => ({ ...customer, key: customer.id }));
            setCustomers(dataWithKeys);
        } catch (err) {
            console.error("Error fetching customers:", err);
            setError('Failed to load customers. Please try again later.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchCustomers();
    }, [fetchCustomers]);

    const columns = [
        {
            title: 'ລຳດັບ',
            key: 'index',
            width: '10%',
            render: (_, __, index) => index + 1,
        },
        {
            title: 'ຊື່ລູກຄ້າ',
            dataIndex: 'name',
            key: 'name',
            width: '35%',
            render: (_, record) => `${record.fname} ${record.lname}`,
        },
        {
            title: 'ເບີໂທ',
            dataIndex: 'phone',
            key: 'phone',
            width: '35%',
        },
        {
            title: 'ຈັດການ',
            key: 'action',
            width: '20%',
            render: (_, record) => (
                <Space size="middle">
                    <Button type="primary" onClick={() => handleEdit(record.id)}>
                        ແກ້ໄຂ
                    </Button>
                    <DeleteCustomer 
                        customerId={record.id} 
                        customerName={`${record.fname} ${record.lname}`}
                        onCustomerDeleted={fetchCustomers}
                    />
                </Space>
            ),
        },
    ];

    const handleEdit = (customerId) => {
        setEditingCustomerId(customerId);
        setIsEditModalVisible(true);
    };

    const handleCloseEditModal = () => {
        setIsEditModalVisible(false);
        setEditingCustomerId(null);
    };

    const handleCustomerUpdated = () => {
        fetchCustomers();
    };

    if (loading && !isEditModalVisible) {
        return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}><Spin size="large" /></div>;
    }

    if (error) {
        return <Alert message="Error" description={error} type="error" showIcon />;
    }

    return (
        <div>
            <h1 className='text-[20px] font-semibold mb-2'>ຂໍ້ມູນລູກຄ້າ</h1>
            <div className=' bg-white p-4 rounded-md '>
                <div className="mb-4 text-right">
                    
                </div>
                <div className="max-w-[1000px]">
                    <Table 
                        dataSource={customers} 
                        columns={columns} 
                        loading={loading && !isEditModalVisible}
                    />
                </div>
            </div>

            <EditCustomer 
                visible={isEditModalVisible}
                customerId={editingCustomerId}
                onClose={handleCloseEditModal}
                onCustomerUpdated={handleCustomerUpdated}
            />
        </div>
    )
}

export default Customer