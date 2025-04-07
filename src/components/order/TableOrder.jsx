import React, { useState, useEffect } from 'react';
import { Button, Space, Table, Tag, Spin, Alert } from 'antd';
import axios from 'axios'; // Ensure axios is installed (`npm install axios` or `yarn add axios`)
import ApiPath from '../../api/apiPath'; // Adjust the path based on your project structure
import moment from 'moment'; // Ensure moment is installed (`npm install moment` or `yarn add moment`)

const columns = [
    {
        title: <p className='text-center'>Order ID</p>,
        dataIndex: 'orderID',
        key: 'orderID',
        // render: (text) => <a>{text}</a>, // Keep original render if needed
    },
    {
        title: 'ວັນ ແລະ ເວລາ',
        dataIndex: 'dateTime',
        key: 'dateTime',
    },
    {
        title: 'ຊື່ຜູ້ຂາຍ',
        dataIndex: 'employee',
        key: 'employee',
    },
    // {
    //     title: 'ໂຕະ', // Table info not directly available in the provided API response
    //     dataIndex: 'table',
    //     key: 'table',
    // },
    {
        title: 'Status',
        key: 'status',
        dataIndex: 'status',
        render: (status) => (
            <Tag color={status === 'Completed' ? 'success' : 'warning'}>
                {status}
            </Tag>
        ),
    },
    {
        title: 'ເບີໂທ',
        dataIndex: 'phone',
        key: 'phone',
    },
    {
        title: 'ລາຄາລວມ',
        dataIndex: 'total',
        key: 'total',
    },
    {
        title: <p className='text-center'>ລາຍລະອຽດ</p>,
        key: 'more',
        render: (_, record) => (
            <div className='flex justify-center'>
                {/* Pass order ID or relevant data to the detail view function/modal */}
                <Button danger type="primary" onClick={() => console.log("View Details for Order:", record.orderID)}>ເບິ່ງລາຍລະອຽດ</Button>
            </div>
        ),
    },
];


const TableOrder = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchOrders = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await axios.get(ApiPath.getOrders);
                // Map API data to the format needed by the table
                const formattedData = response.data.map(order => ({
                    key: order.id, // Add key for React list rendering
                    orderID: <p className='text-center'>{order.id}</p>,
                    dateTime: moment(order.orderDate).format('DD/MM/YYYY HH:mm'), // Format date
                    employee: order.employee ? `${order.employee.fname} ${order.employee.lname}` : 'N/A',
                    // table: 'N/A', // Table info not available
                    status: 'Completed', // Assuming 'Completed'; adjust if status comes from API
                    phone: order.employee ? order.employee.phone : 'N/A',
                    total: (order.total_price || 0).toLocaleString() + ' ກີບ', // Format currency
                }));
                setOrders(formattedData);
            } catch (err) {
                console.error("Error fetching orders:", err);
                setError('Failed to load orders. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, []); // Empty dependency array ensures this runs once on mount

    if (loading) {
        return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}><Spin size="large" /></div>;
    }

    if (error) {
        return <Alert message="Error" description={error} type="error" showIcon />;
    }

    return (
        <div>
            <Table columns={columns} dataSource={orders} />
        </div>
    );
}

export default TableOrder