import React, { useState, useEffect } from 'react';
import { Table, Spin, Alert, Tag, Space, Button, message } from 'antd';
import moment from 'moment';
import axios from 'axios';
import ApiPath from '../../api/apiPath'; // Make sure path is correct

// Removed TypeScript interfaces

// Add these constants at the top with other constants
const RESERVATION_STATUSES = [
    { value: 'pending', label: 'ລໍຖ້າ', color: 'warning' },
    { value: 'confirmed', label: 'ຄອນເຟີມ', color: 'success' },
    { value: 'cancelled', label: 'ຍົກເລຶກ', color: 'error' },
];

// Modify the TableBooking component to include status update handling
const TableBooking = ({ onChange }) => {
    const [reservations, setReservations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [updatingStatus, setUpdatingStatus] = useState({});

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

    // Add this function to handle status updates
    const updateReservationStatus = async (id, newStatus) => {
        try {
            const response = await axios.put(`${ApiPath.updateReservationStatus}/${id}`, {
                status: newStatus
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    };

    // Add this function to handle status changes
    const handleStatusChange = async (reservationId, newStatus) => {
        // ใช้ key ที่รวมทั้ง id และ status เพื่อแยกสถานะการโหลด
        const loadingKey = `${reservationId}_${newStatus}`;
        setUpdatingStatus(prev => ({ ...prev, [loadingKey]: true }));

        try {
            await updateReservationStatus(reservationId, newStatus);
            setReservations(prevReservations =>
                prevReservations.map(reservation =>
                    reservation.id === reservationId
                        ? { ...reservation, status: newStatus }
                        : reservation
                )
            );
            message.success(`ອັບເດດສະຖານະການຈອງເປັນ ${newStatus}`);
        } catch (err) {
            console.error("Error updating reservation status:", err);
            const errorMsg = err.response?.data?.message || 'ການອັບເດດສະຖານະລົ້ມເຫລວ.';
            message.error(errorMsg);
        } finally {
            setUpdatingStatus(prev => ({ ...prev, [loadingKey]: false }));
        }
    };

    // เพิ่มฟังก์ชันสำหรับลบการจอง
    const handleDeleteReservation = async (reservationId) => {
        const loadingKey = `${reservationId}_delete`;
        setUpdatingStatus(prev => ({ ...prev, [loadingKey]: true }));

        try {
            await axios.delete(`${ApiPath.deleteReservation}/${reservationId}`);
            setReservations(prevReservations =>
                prevReservations.filter(reservation => reservation.id !== reservationId)
            );
            message.success('ລົບການຈອງສຳເລັດແລ້ວ');
        } catch (err) {
            console.error("Error deleting reservation:", err);
            const errorMsg = err.response?.data?.message || 'ການລົບການຈອງລົ້ມເຫລວ.';
            message.error(errorMsg);
        } finally {
            setUpdatingStatus(prev => ({ ...prev, [loadingKey]: false }));
        }
    };

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
                let color = 'default';
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
                }
                return (
                    <Tag color={color} key={status}>
                        {String(status).toUpperCase()}
                    </Tag>
                );
            },
            filters: [
                { text: 'Pending', value: 'pending' },
                { text: 'Confirmed', value: 'confirmed' },
                { text: 'Cancelled', value: 'cancelled' },
            ],
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
        {
            title: 'ຈັດການ',
            key: 'action',
            width: '15%',
            render: (_, record) => (
                <Space>
                    {record.status === 'pending' ? (
                        <>
                            <Button
                                type="primary"
                                size="small"
                                loading={updatingStatus[`${record.id}_confirmed`]}
                                onClick={() => handleStatusChange(record.id, 'confirmed')}
                            >
                                ຄອນເຟີມ
                            </Button>
                            <Button
                                danger
                                size="small"
                                loading={updatingStatus[`${record.id}_cancelled`]}
                                onClick={() => handleStatusChange(record.id, 'cancelled')}
                            >
                                ຍົກເລຶກ
                            </Button>
                        </>
                    ) : (
                        <Button
                            danger
                            size="small"
                            loading={updatingStatus[`${record.id}_delete`]}
                            onClick={() => handleDeleteReservation(record.id)}
                        >
                            ລົບ
                        </Button>
                    )}
                </Space>
            ),
        },
    ];

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