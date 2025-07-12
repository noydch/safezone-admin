import React, { useState } from 'react';
import { Modal, Form, Tabs } from 'antd';
import ModalBooking from './ModalBooking';
import TableBooking from './TableBooking';
import TableBookingHistory from './TableBookingHistory';

const Booking = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [form] = Form.useForm();
    const [refreshKey, setRefreshKey] = useState(0);

    const handleOpenModal = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        form.resetFields();
        setIsModalOpen(false);
        setRefreshKey(prevKey => prevKey + 1);
    };

    const onTableChange = (pagination, filters, sorter, extra) => {
        console.log('Table params changed in Booking:', pagination, filters, sorter, extra);
    };

    const items = [
        {
            key: '1',
            label: 'ລາຍການຈອງທັງໝົດ',
            children: (
                <TableBooking
                    key={refreshKey}
                    onChange={onTableChange}
                />
            ),
        },
        {
            key: '2',
            label: 'ປະຫວັດການຈອງ',
            children: (
                <TableBookingHistory
                    key={`cancelled-${refreshKey}`}
                />
            ),
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
                        ເພີ່ມລາຍການຈອງ
                    </button>
                    <ModalBooking
                        form={form}
                        isModalOpen={isModalOpen}
                        handleCloseModal={handleCloseModal}
                        onBookingCreated={() => setRefreshKey(prevKey => prevKey + 1)}
                    />
                </div>

                <Tabs defaultActiveKey="1" items={items} />
            </div>
        </div>
    );
};

export default Booking;