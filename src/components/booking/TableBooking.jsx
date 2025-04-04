import React, { useState, useEffect } from 'react';
import { Table, Spin, Alert, Tag } from 'antd';
import moment from 'moment';
import axios from 'axios';
import ApiPath from '../../api/apiPath'; // Make sure path is correct

// Removed TypeScript interfaces

// Moved columns definition inside the component or keep it outside if preferred
const columns = [
    {
        title: 'ລຳດັບ',
        dataIndex: 'id',
        key: 'id',
        width: '5%',
        sorter: (a, b) => a.id - b.id,
    },
    {
        title: 'ວັນທີ ແລະ ເວລາ',
        dataIndex: 'datetime',
        key: 'datetime',
        width: '20%',
        sorter: (a, b) => {
            const dateA = moment(a._reservationTime);
            const dateB = moment(b._reservationTime);
            // Use valueOf() for comparison in JS as well
            return dateA.valueOf() - dateB.valueOf(); 
        },
    },
    {
        title: 'ເລກໂຕະ',
        dataIndex: 'tableNo',
        key: 'tableNo',
        width: '10%',
    },
    {
        title: 'ສະຖານະ',
        dataIndex: 'status',
        key: 'status',
        width: '10%',
        render: (status) => {
            let color = 'default'; // Use let for reassignment
            switch (status) {
                case 'confirmed':
                    color = 'success';
                    break;
                case 'pending':
                    color = 'warning';
                    break;
                case 'cancelled':
                    color = 'error';
                    break;
                // default case handles any other status
            }
            return (
                <Tag color={color} key={status}>
                    {/* Ensure status is a string before calling toUpperCase */}
                    {String(status).toUpperCase()}
                </Tag>
            );
        },
        filters: [
            { text: 'Pending', value: 'pending' },
            { text: 'Confirmed', value: 'confirmed' },
            { text: 'Cancelled', value: 'cancelled' },
        ],
        // Ensure value is treated as string for comparison
        onFilter: (value, record) => record.status.indexOf(String(value)) === 0,
    },
    {
        title: 'ຊື່ລູກຄ້າ',
        dataIndex: 'customer',
        key: 'customer',
        width: '20%',
    },
    {
        title: 'ເບີ',
        dataIndex: 'phone',
        key: 'phone',
        width: '15%',
    },
];

// Component now fetches its own data
const TableBooking = ({ onChange }) => { // Receive onChange prop
    const [reservations, setReservations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch data on component mount (and when key prop changes)
    useEffect(() => {
        const fetchReservations = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await axios.get(ApiPath.getReservations);
                const formattedData = response.data.map(res => ({
                    key: res.id,
                    id: res.id,
                    datetime: moment(res.reservationTime).format('DD/MM/YYYY HH:mm'),
                    tableNo: res.table ? `No.${res.table.table_number}` : 'N/A',
                    status: res.status,
                    customer: res.customer ? `${res.customer.fname} ${res.customer.lname}` : 'N/A',
                    phone: res.customer ? res.customer.phone : 'N/A',
                    _reservationTime: res.reservationTime 
                }));
                setReservations(formattedData);
            } catch (err) {
                console.error("Error fetching reservations:", err);
                setError('Failed to load reservations. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchReservations();
    }, []); // Empty dependency array means fetch only on initial mount (or key change)

    if (loading) {
        return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '300px' }}><Spin size="large" /></div>;
    }

    if (error) {
        return <Alert message="Error" description={error} type="error" showIcon />;
    }

    return (
        <Table
            columns={columns}
            dataSource={reservations}
            onChange={onChange} // Pass the onChange handler to Ant Table
            pagination={{ pageSize: 10 }}
            rowKey="key"
        />
    );
};

export default TableBooking; 