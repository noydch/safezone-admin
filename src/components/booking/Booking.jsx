import React, { useState } from 'react';
import { Modal, Form, Tabs, Result } from 'antd'; // Import Result
import ModalBooking from './ModalBooking';
import TableBooking from './TableBooking';
import TableBookingHistory from './TableBookingHistory';
import useSafezoneStore from '../../store/safezoneStore'; // Import useSafezoneStore

const Booking = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [form] = Form.useForm();
    const [refreshKey, setRefreshKey] = useState(0);
    const user = useSafezoneStore((state) => state.user); // Get user object from store


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
            {/* Updated role check to include 'Cashier' and 'Waiter' */}
            {user && (user.role === 'Owner' || user.role === 'Manager' || user.role === 'Cashier' || user.role === 'Waiter') ? (
                <>
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
                </>
            ) : (
                <Result
                    status="403" // Use 403 status for Forbidden access
                    title="403"
                    subTitle="ທ່ານບໍ່ມີສິດໃນການເບິ່ງຂໍ້ມູນນີ້!" // Your desired message
                    extra={
                        <p className="text-gray-600">ກະລຸນາຕິດຕໍ່ຜູ້ເບິ່ງແຍງລະບົບຖ້າທ່ານຄິດວ່ານີ້ແມ່ນຂໍ້ຜິດພາດ.</p>
                    }
                />
            )}
        </div>
    );
};

export default Booking;