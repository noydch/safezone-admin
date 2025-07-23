import { Col, Form, Input, message, Modal, Popconfirm, Row, Skeleton, Tabs } from 'antd' // Import Tabs
import React, { useEffect, useState } from 'react'
import { MdTableBar } from 'react-icons/md'
import useSafezoneStore from '../../store/safezoneStore';
import ModalAddTable from './ModalAddTable';
import ModalEditTable from './ModalEditTable';
import { delTableApi } from '../../api/table';
import ModalMergeTable from './ModalMergeTable';

const { TabPane } = Tabs; // Destructure TabPane

const TableManagement = () => {
    const listTable = useSafezoneStore((state) => state.listTable)
    const tables = useSafezoneStore((state) => state.tables)
    const loading = useSafezoneStore((state) => state.loading);
    const token = useSafezoneStore((state) => state.token)
    const user = useSafezoneStore((state) => state.user)
    const listTableGroups = useSafezoneStore((state) => state.listTableGroups) // Get the new action
    const tableGroups = useSafezoneStore((state) => state.tableGroups) // Get the new state
    const [form] = Form.useForm();

    useEffect(() => {
        listTable()
        listTableGroups() // Call the new action to fetch merged tables
    }, [listTable, listTableGroups]) // Add listTableGroups to dependency array
    console.log(tables);
    console.log("tableGroups", tableGroups); // Log the merged tables for debugging


    const handleDeleteTable = async (id, table_number) => {
        console.log(id);

        try {
            const response = await delTableApi(token, id)
            if (response) {
                listTable()
                listTableGroups() // Re-fetch merged tables after deletion, in case a merged table was deleted
                message.success(`ລົບໂຕະ ${table_number} ສຳເລັດ!!!`)
            }
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div className=' h-screen'>
            {/* Removed the top-level user role check, so all users can see the table list */}
            <>
                <div className=' flex items-end justify-between'>
                    <h1 className=' text-[18px] font-medium'>ລາຍການໂຕະ</h1>
                    <div className=' flex items-center gap-x-2'>
                        <ModalMergeTable listTable={listTable} tables={tables} />
                        {user && (user.role === 'Owner' || user.role === 'Manager') && ( // Conditionally render Add Table button
                            <ModalAddTable listTable={listTable} />
                        )}
                    </div>
                </div>
                <div className=' bg-white p-4 h-full mt-2 rounded-md'>
                    <Tabs defaultActiveKey="1">
                        <TabPane tab="ລາຍການໂຕະ" key="1">
                            {loading ? (
                                <ul className=' grid grid-cols-6 gap-3 place-items-center'>
                                    {Array.from({ length: 6 }).map((_, index) => (
                                        <li key={index} className=' flex flex-col justify-between w-[190px] h-[110px] p-2 bg-white drop-shadow-md border border-gray-200 rounded-md'>
                                            <div className='flex justify-between'>
                                                <Skeleton.Avatar active size={64} shape="square" />
                                                <div className='flex flex-col items-end'>
                                                    <Skeleton.Input style={{ width: 80, height: 24, marginBottom: 4 }} active size="small" />
                                                    <Skeleton.Input style={{ width: 60, height: 12 }} active size="small" />
                                                </div>
                                            </div>
                                            <div className='flex justify-between items-end mt-2'>
                                                <Skeleton.Input style={{ width: 70, height: 10 }} active size="small" />
                                                <div className='flex items-center gap-x-2'>
                                                    <Skeleton.Button active size="small" shape="round" />
                                                    <Skeleton.Button active size="small" shape="round" />
                                                </div>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <ul className=' grid grid-cols-6 gap-3 place-items-center'>
                                    {tables.map((table, index) => (
                                        <li key={index} className=' flex flex-col justify-between w-[190px] h-[140px] p-2 bg-white drop-shadow-md border border-gray-200 rounded-md'>
                                            <div className=' flex justify-between'>
                                                <MdTableBar className=' text-[70px]' />
                                                <div className=' flex flex-col items-end leading-6'>
                                                    <h2 className='text-[24px] font-medium text-red-500'>ໂຕະ {table.table_number}</h2>
                                                    <span className=' text-[12px] font-medium '>{table.mergedName}</span>
                                                    <span className=' text-[12px] font-medium '>{table.seat} ບ່ອນນັ່ງ</span>
                                                    <span className={`text-[12px] font-medium ${table.status === 'ຖືກຈອງແລ້ວ' ? 'text-red-500' :
                                                        table.status === 'ວ່າງ' ? 'text-green-500' : 'text-yellow-500'
                                                        }`}>
                                                        {table.status}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className=' flex justify-between items-end'>
                                                <span className=' text-[10px] text-gray-500'>{new Date(table.createdAt).toLocaleDateString()}</span>
                                                {user && (user.role === 'Owner' || user.role === 'Manager') && ( // Conditionally render Edit and Delete buttons
                                                    <div className=' flex items-center gap-x-2'>
                                                        <ModalEditTable listTable={listTable} tableId={table.id} />
                                                        <Popconfirm
                                                            title="ຄຳຢືນຢັນ"
                                                            description="ເຈົ້າຕ້ອງການລົບລາຍການນີ້ບໍ່ ?"
                                                            okText="ຢືນຢັນ"
                                                            cancelText="ຍົກເລີກ"
                                                            onConfirm={() => handleDeleteTable(table.id, table.table_number)}>
                                                            <button
                                                                className=' bg-red-500 text-[12px] text-white w-[50px] py-0.5 rounded border-1 border-transparent hover:border-1 hover:bg-transparent hover:border-red-500 hover:text-red-500 duration-300 cursor-pointer'>
                                                                ລົບ
                                                            </button>
                                                        </Popconfirm>
                                                    </div>
                                                )}
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </TabPane>
                        <TabPane tab="ລາຍການໂຕະທີ່ລວມ" key="2">
                            {loading ? (
                                <Skeleton active paragraph={{ rows: 4 }} />
                            ) : tableGroups.length === 0 ? (
                                <p className=' text-center text-gray-500'>ບໍ່ມີໂຕະທີ່ລວມ</p>
                            ) : (
                                <div className=' grid grid-cols-1 gap-4'>
                                    {tableGroups.map((group) => (
                                        <div key={group.id} className=' bg-gray-50 p-4 rounded-md shadow-sm'>
                                            <h3 className=' text-[16px] font-medium mb-2'>
                                                ກຸ່ມໂຕະ {group.id} (ສ້າງເມື່ອ: {new Date(group.createdAt).toLocaleDateString()})
                                            </h3>
                                            <div className='grid grid-cols-4 gap-3 place-items-center'>
                                                {group.tables.map((table) => (
                                                    <div key={table.id} className=' flex flex-col justify-between w-[190px] h-[140px] p-2 bg-white drop-shadow-md border border-gray-200 rounded-md'>
                                                        <div className=' flex justify-between'>
                                                            <MdTableBar className=' text-[70px]' />
                                                            <div className=' flex flex-col items-end leading-6'>
                                                                <h2 className='text-[24px] font-medium text-blue-500'>ໂຕະ {table.table_number}</h2>
                                                                <span className=' text-[12px] font-medium '>{table.seat} ບ່ອນນັ່ງ</span>
                                                                <span className={`text-[12px] font-medium ${table.status === 'ຖືກຈອງແລ້ວ' ? 'text-red-500' :
                                                                    table.status === 'ວ່າງ' ? 'text-green-500' : 'text-yellow-500'
                                                                    }`}>
                                                                    {table.status}
                                                                </span>
                                                            </div>
                                                        </div>
                                                        <div className=' flex justify-between items-end'>
                                                            <span className=' text-[10px] text-gray-500'>{new Date(table.createdAt).toLocaleDateString()}</span>
                                                            {/* You might want to add actions here specific to merged tables if needed */}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </TabPane>
                    </Tabs>
                </div>
            </>
        </div>
    )
}

export default TableManagement