// src/components/dashboard/DashboardMain.jsx
import React, { useState, useEffect } from 'react'
import { Select, Skeleton } from 'antd';
import { AiOutlineDollar } from 'react-icons/ai'
import { BsFillCartCheckFill } from 'react-icons/bs';
import { GiNotebook } from "react-icons/gi";
import { MdPlaylistRemove, MdTableBar } from 'react-icons/md';
import SaleBarChart from './SaleBarChart';
import TableDashboard from './TableDashboard';
import OrderBarChart from './OrderBarChart';
import { getAllOrdersApi } from '../../api/order';
import { getTableApi } from '../../api/table';

const DashboardMain = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [orderStats, setOrderStats] = useState({
        totalOrders: 0,
        completedOrders: 0,
        pendingOrders: 0
    });
    const [todaySales, setTodaySales] = useState(0);
    const [availableTables, setAvailableTables] = useState(0);
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('token');
                const orderResponse = await getAllOrdersApi(token);
                const ordersData = orderResponse.data;
                setOrders(ordersData);

                const today = new Date();
                const todayStr = today.toISOString().split('T')[0];

                const todayOrders = ordersData.filter(order => {
                    if (!order.updatedAt) return false;
                    const orderDate = new Date(order.updatedAt).toISOString().split('T')[0];
                    return orderDate === todayStr;
                });

                const totalSales = todayOrders.reduce((sum, order) => sum + (order.total_price || 0), 0);
                setTodaySales(totalSales);

                const completedOrders = ordersData.filter(order =>
                    order.payment_method === 'TRANSFER' || order.payment_method === 'CASH'
                ).length;

                const pendingOrders = ordersData.filter(order =>
                    !order.payment_method
                ).length;

                setOrderStats({
                    totalOrders: todayOrders.length,
                    completedOrders: completedOrders,
                    pendingOrders: pendingOrders
                });

                const tableResponse = await getTableApi();
                const tables = tableResponse.data;

                const availableCount = tables.filter(table => table.status === 'ວ່າງ').length;
                setAvailableTables(availableCount);

            } catch (error) {
                console.error('Error fetching dashboard data:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleChange = (value) => {
        console.log(value);
    };

    if (isLoading) {
        return (
            <div className='overflow-x-auto'>
                <ul className='flex items-center gap-x-10 mb-7 min-w-[1200px]'>
                    {[...Array(5)].map((_, index) => (
                        <li key={index} className='w-[220px] h-[120px] bg-white rounded-md p-3.5 drop-shadow'>
                            <Skeleton active paragraph={{ rows: 2 }} />
                        </li>
                    ))}
                </ul>

                <div className='flex gap-x-5 mb-5 min-w-[1200px]'>
                    <div className='flex-1 bg-white p-4 rounded-md drop-shadow'>
                        <Skeleton active />
                    </div>
                    <div className='flex-1 bg-white p-4 rounded-md drop-shadow'>
                        <Skeleton active />
                    </div>
                </div>

                <div className='bg-white p-4 rounded-md drop-shadow min-w-[1200px]'>
                    <Skeleton active title={false} paragraph={{ rows: 4 }} />
                </div>
            </div>
        );
    }

    return (
        <div className='overflow-x-auto'>
            <ul className='flex items-center gap-x-10 min-w-[1200px]'>
                <li className=' w-[220px] h-[120px] bg-white rounded-md px-3.5 flex items-center justify-between drop-shadow'>
                    <div className=' space-y-9'>
                        <h4 className=' text-[18px] font-semibold'>
                            ຍອດຂາຍມື້ນີ້
                        </h4>
                        <h2 className=' text-green-500 text-[20px] font-bold'>
                            {todaySales.toLocaleString()} ກີບ
                        </h2>
                    </div>
                    <div className=' w-[40px] h-[40px] bg-green-100 flex items-center justify-center rounded-full'>
                        <AiOutlineDollar className=' text-[28px] text-green-500' />
                    </div>
                </li>
                <li className=' w-[220px] h-[120px] bg-white rounded-md px-3.5 flex items-center justify-between drop-shadow'>
                    <div className=' space-y-9'>
                        <h4 className=' text-[18px] font-semibold'>
                            ຈຳນວນອໍເດີທີ່ສຳເລັດ
                        </h4>
                        <h2 className=' text-orange-500 text-[20px] font-bold'>
                            {orderStats.completedOrders} ອໍເດີ້
                        </h2>
                    </div>
                    <div className=' w-[40px] h-[40px] bg-orange-100 flex items-center justify-center rounded-full'>
                        <GiNotebook className=' text-[28px] text-orange-500' />
                    </div>
                </li>
                <li className=' w-[220px] h-[120px] bg-white rounded-md px-3.5 flex items-center justify-between drop-shadow'>
                    <div className=' space-y-9'>
                        <h4 className=' text-[18px] font-semibold'>
                            ຈຳນວນອໍເດີ້ມື້ນີ້
                        </h4>
                        <h2 className=' text-blue-500 text-[20px] font-bold'>
                            {orderStats.totalOrders} ອໍເດີ້
                        </h2>
                    </div>
                    <div className=' w-[40px] h-[40px] bg-blue-100 flex items-center justify-center rounded-full'>
                        <BsFillCartCheckFill className=' text-[28px] text-blue-500' />
                    </div>
                </li>
                <li className=' w-[220px] h-[120px] bg-white rounded-md px-3.5 flex items-center justify-between drop-shadow'>
                    <div className=' space-y-9'>
                        <h4 className=' text-[18px] font-semibold'>
                            ຈຳນວນອໍເດີ້ທີ່ຍັງບໍ່ແລ້ວ
                        </h4>
                        <h2 className=' text-red-500 text-[20px] font-bold'>
                            {orderStats.pendingOrders} ອໍເດີ້
                        </h2>
                    </div>
                    <div className=' w-[40px] h-[40px] bg-red-100 flex items-center justify-center rounded-full'>
                        <MdPlaylistRemove className=' text-[28px] text-red-500' />
                    </div>
                </li>
                <li className=' w-[220px] h-[120px] bg-white rounded-md px-3.5 flex items-center justify-between drop-shadow'>
                    <div className=' space-y-9'>
                        <h4 className=' text-[18px] font-semibold'>
                            ໂຕະທີ່ຍັງວ່າງ
                        </h4>
                        <h2 className=' text-yellow-500 text-[20px] font-bold'>
                            {availableTables} ໂຕະ
                        </h2>
                    </div>
                    <div className=' w-[40px] h-[40px] bg-yellow-100 flex items-center justify-center rounded-full'>
                        <MdTableBar className=' text-[28px] text-yellow-500' />
                    </div>
                </li>
            </ul>

            <div className='mt-7 flex gap-x-5 min-w-[1200px]'>
                <div className='flex-1 bg-white p-4 rounded-md'>
                    <div className=' flex items-center justify-between'>
                        <div>
                            <p className=' text-[12px] text-gray-500'>ການເຄື່ອນໄຫວ</p>
                            <h1 className=' font-medium text-[18px]'>
                                ຈຳນວນຍອດຂາຍ
                            </h1>
                        </div>
                    </div>
                    <SaleBarChart orders={orders} />
                </div>
                <div className='flex-1 bg-white p-4 rounded-md'>
                    <div className=' flex items-center justify-between'>
                        <div>
                            <p className=' text-[12px] text-gray-500'>ການເຄື່ອນໄຫວ</p>
                            <h1 className=' font-medium text-[18px]'>
                                ຈຳນວນຍອດອໍເດີ
                            </h1>
                        </div>
                    </div>
                    <OrderBarChart orders={orders} />
                </div>
            </div>

            <div className='mt-5 min-w-[1200px]'>
                <h1 className=' text-[18px] font-medium mb-1'>
                    ລາຍການອໍເດີ້ລ່າສຸດ
                </h1>
                <TableDashboard />
            </div>
        </div>
    )
}

export default DashboardMain