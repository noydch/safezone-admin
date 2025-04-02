import React from 'react';
import { Table } from 'antd';

const ImportTable = ({ importData, handleEdit, handleDelete }) => {
    const columns = [
        {
            title: 'ເລກທີນຳເຂົ້າ',
            dataIndex: 'importNumber',
            key: 'importNumber'
        },
        {
            title: 'ຊື່ສິນຄ້າ',
            dataIndex: 'productName',
            key: 'productName'
        },
        {
            title: 'ປະເພດສິນຄ້າ',
            dataIndex: 'category',
            key: 'category'
        },
        {
            title: 'ຈຳນວນ',
            dataIndex: 'quantity',
            key: 'quantity'
        },
        {
            title: 'ລາຄານຳເຂົ້າ',
            dataIndex: 'importPrice',
            key: 'importPrice'
        },
        {
            title: 'ລາຄາລວມ',
            dataIndex: 'totalAmount',
            key: 'totalAmount'
        },
        {
            title: 'ວັນທີນຳເຂົ້າ',
            dataIndex: 'importDate',
            key: 'importDate'
        },
        {
            title: 'ສະຖານະ',
            dataIndex: 'status',
            key: 'status'
        },
        {
            title: 'ຈັດການ',
            key: 'action',
            render: (_, record) => (
                <div className="flex gap-2">
                    <button
                        onClick={() => handleEdit(record)}
                        className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
                    >
                        ແກ້ໄຂ
                    </button>
                    <button
                        onClick={() => handleDelete(record)}
                        className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                    >
                        ລົບ
                    </button>
                </div>
            )
        }
    ];

    return (
        <Table
            columns={columns}
            dataSource={importData}
            rowKey="id"
        />
    );
};

export default ImportTable;