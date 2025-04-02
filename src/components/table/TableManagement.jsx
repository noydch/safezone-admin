import { Col, Form, Input, message, Modal, Popconfirm, Row } from 'antd'
import React, { useEffect, useState } from 'react'
import { MdTableBar } from 'react-icons/md'
import useSafezoneStore from '../../store/safezoneStore';
import ModalAddTable from './ModalAddTable';
import ModalEditTable from './ModalEditTable';
import { delTableApi } from '../../api/table';

const TableManagement = () => {
    const listTable = useSafezoneStore((state) => state.listTable)
    const tables = useSafezoneStore((state) => state.tables)
    const token = useSafezoneStore((state) => state.token)
    const [form] = Form.useForm();

    useEffect(() => {
        listTable()
    }, [])

    const handleDeleteTable = async (id, table_number) => {
        console.log(id);

        try {
            const response = await delTableApi(token, id)
            if (response) {
                listTable()
                message.success(`ລົບໂຕະ ${table_number} ສຳເລັດ!!!`)
            }
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div className=' h-screen'>
            <div className=' flex items-end justify-between'>
                <h1 className=' text-[18px] font-medium'>ລາຍການໂຕະ</h1>
                <ModalAddTable listTable={listTable} />
            </div>
            <div className=' bg-white p-4 h-full mt-2 rounded-md'>
                <ul className=' grid grid-cols-6 gap-3 place-items-center'>
                    {tables.map((table, index) => (
                        <li key={index} className=' flex flex-col justify-between w-[190px] h-[110px] p-2 bg-white drop-shadow-md border border-gray-200 rounded-md'>
                            <div className=' flex justify-between'>
                                <MdTableBar className=' text-[64px]' />
                                <div className=' flex flex-col items-end leading-6'>
                                    <h2 className='text-[24px] font-medium text-red-500'>ໂຕະ {table.table_number}</h2>
                                    <span className=' text-[12px] font-medium '>{table.seat} ບ່ອນນັ່ງ</span>
                                </div>
                            </div>
                            <div className=' flex justify-between items-end'>
                                <span className=' text-[10px] text-gray-500'>{new Date(table.createdAt).toLocaleDateString()}</span>
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
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    )
}

export default TableManagement