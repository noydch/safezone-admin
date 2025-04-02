import React, { useState } from 'react';
import { Table, DatePicker, Modal, Form } from 'antd';
import moment from 'moment';
import ModalBooking from './ModalBooking';

const { RangePicker } = DatePicker;

const Booking = () => {
    const [filteredData, setFilteredData] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const [form] = Form.useForm();
    const handleOpenModal = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        form.resetFields();
        setIsModalOpen(false);
    };



    const handleDateRangeChange = (dates) => {
        if (!dates || dates.length === 0) {
            setFilteredData(null);
            return;
        }

        const [startDate, endDate] = dates;
        const filtered = data.filter(item => {
            const itemDate = new Date(item.date.split('/').reverse().join('-') + ' ' + item.time);
            return itemDate >= startDate && itemDate <= endDate;
        });
        setFilteredData(filtered);
    };

    const onChange = (pagination, filters, sorter, extra) => {
        console.log('params', pagination, filters, sorter, extra);
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
            render: (_, record) => `${record.date} ${record.time}`,
            sorter: (a, b) => {
                const dateA = moment(a.date + ' ' + a.time, 'DD/MM/YYYY HH:mm');
                const dateB = moment(b.date + ' ' + b.time, 'DD/MM/YYYY HH:mm');
                return dateA - dateB;
            },

        },
        {
            title: 'ເລກໂຕະ',
            dataIndex: 'tableNo',
            key: 'tableNo',
            width: '10%',
        },
        {
            title: 'ຊື່ພະນັກງານ',
            dataIndex: 'staff',
            key: 'staff',
            width: '20%',
        },
        {
            title: 'ສະຖານະ',
            dataIndex: 'status',
            key: 'status',
            width: '10%',
            render: (status) => (
                <span className="bg-orange-100 text-orange-500 px-2 py-1 rounded">
                    {status}
                </span>
            ),
        },
        {
            title: 'ຊື່ລູກຄ້າ',
            dataIndex: 'customer',
            key: 'customer',
            width: '15%',
        },
        {
            title: 'ເບີ',
            dataIndex: 'phone',
            key: 'phone',
            width: '15%',
        },
    ];

    const data = [
        {
            key: '1',
            id: '1',
            date: '19/12/2025',
            time: '14:32',
            tableNo: 'No.1',
            staff: 'Saysamone Dch',
            status: 'Booking',
            customer: 'Jack',
            phone: '020 97241018',
        },
        {
            key: '2',
            id: '2',
            date: '20/12/2025',
            time: '10:32',
            tableNo: 'No.1',
            staff: 'Saysamone Dch',
            status: 'Booking',
            customer: 'Tom',
            phone: '020 97241018',
        },
        {
            key: '3',
            id: '3',
            date: '20/12/2025',
            time: '14:32',
            tableNo: 'No.1',
            staff: 'Saysamone Dch',
            status: 'Booking',
            customer: 'Kie',
            phone: '020 97241018',
        },
    ];



    return (
        <div>
            <h1 className='text-[20px] font-semibold mb-2'>ຈັດການການຈອງ</h1>
            <div className='bg-white rounded-md p-4'>
                <div className='flex justify-end mb-4'>
                    <button
                        onClick={handleOpenModal}
                        className='h-[40px] w-[150px] font-medium rounded bg-red-500 text-center text-white border-2 border-transparent hover:border-2 hover:bg-transparent hover:border-red-500 hover:text-red-500 duration-300 cursor-pointer'>
                        ເພີ່ມລາຍການການຈອງ
                    </button>
                    <ModalBooking
                        form={form}
                        isModalOpen={isModalOpen}
                        handleCloseModal={handleCloseModal}
                    />
                </div>

                <Table
                    columns={columns}
                    dataSource={filteredData || data}
                    onChange={onChange}
                    pagination={{ pageSize: 10 }}
                />
            </div>
        </div>
    );
};

export default Booking;