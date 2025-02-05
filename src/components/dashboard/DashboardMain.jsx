// src/components/dashboard/DashboardMain.jsx
import React from 'react'
import { Select } from 'antd';
import { AiOutlineDollar } from 'react-icons/ai'
import { BsFillCartCheckFill } from 'react-icons/bs';
import { GiNotebook } from "react-icons/gi";
import { MdPlaylistRemove, MdTableBar } from 'react-icons/md';
import SaleBarChart from './SaleBarChart';
import TableDashboard from './TableDashboard';
import OrderBarChart from './OrderBarChart';

const DashboardMain = () => {
    const handleChange = (value) => {
        console.log(value); // { value: "lucy", key: "lucy", label: "Lucy (101)" }
    };
    return (
        <div>
            <ul className=' flex items-center gap-x-10'>
                <li className=' w-[220px] h-[120px] bg-white rounded-md px-3.5 flex items-center justify-between drop-shadow'>
                    <div className=' space-y-9'>
                        <h4 className=' text-[18px] font-semibold'>
                            ຍອດຂາຍມື້ນີ້
                        </h4>
                        <h2 className=' text-green-500 text-[20px] font-bold'>
                            590,000 ກີບ
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
                            59 ອໍເດີ້
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
                            69 ອໍເດີ້
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
                            10 ອໍເດີ້
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
                            10 ໂຕະ
                        </h2>
                    </div>
                    <div className=' w-[40px] h-[40px] bg-yellow-100 flex items-center justify-center rounded-full'>
                        <MdTableBar className=' text-[28px] text-yellow-500' />
                    </div>
                </li>
            </ul>

            {/* Chart */}
            <div className=' mt-7 flex gap-x-5'>
                <div className=' w-[620px] bg-white p-4 rounded-md'>
                    <div className=' flex items-center justify-between'>
                        <div>
                            <p className=' text-[12px] text-gray-500'>ການເຄື່ອນໄຫວ</p>
                            <h1 className=' font-medium text-[18px]'>
                                ຈຳນວນຍອດຂາຍ
                            </h1>
                        </div>
                        <Select
                            labelInValue
                            defaultValue={{
                                value: 'ລາຍວັນ',
                                label: 'ລາຍວັນ',
                            }}
                            style={{
                                width: 120,
                            }}
                            onChange={handleChange}
                            options={[
                                {
                                    value: 'ລາຍວັນ',
                                    label: 'ລາຍວັນ',
                                },
                                {
                                    value: 'ລາຍເດືອນ',
                                    label: 'ລາຍເດືອນ',
                                },
                                {
                                    value: 'ລາຍປີ',
                                    label: 'ລາຍປີ',
                                },
                            ]}
                        />
                    </div>
                    <SaleBarChart />
                </div>
                <div className=' w-[620px] bg-white p-4 rounded-md'>
                    <div className=' flex items-center justify-between'>
                        <div>
                            <p className=' text-[12px] text-gray-500'>ການເຄື່ອນໄຫວ</p>
                            <h1 className=' font-medium text-[18px]'>
                                ຈຳນວນຍອດຂາຍ
                            </h1>
                        </div>
                        <Select
                            labelInValue
                            defaultValue={{
                                value: 'ລາຍວັນ',
                                label: 'ລາຍວັນ',
                            }}
                            style={{
                                width: 120,
                            }}
                            onChange={handleChange}
                            options={[
                                {
                                    value: 'ລາຍວັນ',
                                    label: 'ລາຍວັນ',
                                },
                                {
                                    value: 'ລາຍເດືອນ',
                                    label: 'ລາຍເດືອນ',
                                },
                                {
                                    value: 'ລາຍປີ',
                                    label: 'ລາຍປີ',
                                },
                            ]}
                        />
                    </div>
                    <OrderBarChart />
                </div>

            </div>

            {/* Order */}
            <div className=' mt-5'>
                <h1 className=' text-[18px] font-medium mb-1'>
                    ລາຍການອໍເດີ້ລ່າສຸດ
                </h1>
                <TableDashboard />
            </div>
        </div>
    )
}

export default DashboardMain