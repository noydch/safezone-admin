import React, { useState, useEffect } from 'react';
import { Table, Spin, Alert, Tag, Space, Button, message, Modal } from 'antd';
import moment from 'moment';
import axios from 'axios';
import ApiPath from '../../api/apiPath';

const TableBookingHistory = ({ refreshKey }) => {
    const [reservations, setReservations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [deleting, setDeleting] = useState({});

    // Fetch data whenever refreshKey changes (or on initial mount)
    useEffect(() => {
        const fetchCancelledReservations = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await axios.get(ApiPath.getReservations);
                // Filter for 'cancelled' or 'confirmed' reservations
                const filteredData = response.data.filter(res =>
                    res.status === 'cancelled' || res.status === 'confirmed'
                );

                const formattedData = filteredData.map(res => ({
                    key: res.id,
                    id: res.id,
                    datetime: moment(res.reservationTime).local().format('DD/MM/YYYY HH:mm'),
                    tableNo: res.table ? `No.${res.table.table_number}` : 'N/A',
                    status: res.status,
                    customer: res.customer ? `${res.customer.fname} ${res.customer.lname}` : 'N/A',
                    phone: res.customer ? res.customer.phone : 'N/A',
                    _reservationTime: res.reservationTime
                }));
                setReservations(formattedData);
            } catch (err) {
                console.error("Error fetching cancelled reservations:", err);
                setError('Failed to load cancelled reservations. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchCancelledReservations();
    }, [refreshKey]); // Depend on refreshKey to re-fetch when parent triggers

    const handleDeleteReservation = async (reservationId) => {
        Modal.confirm({
            title: 'ຢືນຢັນການລົບ',
            content: 'ທ່ານແນ່ໃຈບໍວ່າຕ້ອງການລົບລາຍການຈອງນີ້?',
            okText: 'ລົບ',
            okType: 'danger',
            cancelText: 'ຍົກເລີກ',
            onOk: async () => {
                setDeleting(prev => ({ ...prev, [reservationId]: true }));
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
                    setDeleting(prev => ({ ...prev, [reservationId]: false }));
                }
            },
        });
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
                let color;
                if (status === 'cancelled') {
                    color = 'error';
                } else if (status === 'confirmed') {
                    color = 'success';
                } else if (status === 'completed') {
                    color = 'processing';
                } else {
                    color = 'default'; // For any other status
                }
                return (
                    <Tag color={color} key={status}>
                        {String(status).toUpperCase()}
                    </Tag>
                );
            },
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
                    <Button
                        danger
                        size="small"
                        loading={deleting[record.id]}
                        onClick={() => handleDeleteReservation(record.id)}
                    >
                        ລົບ
                    </Button>
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
            pagination={{ pageSize: 10 }}
            rowKey="key"
        />
    );
};

export default TableBookingHistory; 