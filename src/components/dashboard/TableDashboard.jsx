import React from 'react'
import { Button, Space, Table, Tag } from 'antd';

const columns = [
    {
        title: <p className=' text-center'>Order ID</p>,
        dataIndex: 'orderID',
        key: 'orderID',
        render: (text) => <a>{text}</a>,
    },
    {
        title: 'ວັນ ແລະ ເວລາ',
        dataIndex: 'dateTime',
        key: 'dateTime',
    },
    {
        title: 'ຊື່ຜູ້ຂາຍ',
        dataIndex: 'employee',
        key: 'employee',
    },
    {
        title: 'ໂຕະ',
        dataIndex: 'table',
        key: 'table',
    },
    {
        title: 'Status',
        key: 'status',
        dataIndex: 'status',
        render: (_, { tags }) => (
            <>
                <Tag color='warning'>
                    {tags}
                </Tag>
            </>
        ),
    },
    {
        title: 'ເບີໂທ',
        dataIndex: 'phone',
        key: 'phone',
    },
    {
        title: 'ລາຄາລວມ',
        dataIndex: 'total',
        key: 'total',
    },
    {
        title: <p className=' text-center'>ລາຍລະອຽດ</p>,
        dataIndex: 'more',
        key: 'more',
    },
];
const data = [
    {
        orderID: <p className=' text-center'>1</p>,
        dateTime: '20/01/2025 14:34',
        table: 2,
        employee: 'Kiekie',
        tags: 'Pending',
        phone: '20 9724 1010',
        total: (190000).toLocaleString() + ' ກີບ',
        more: <div className=' flex justify-center'>
            <Button danger type="primary">ເບິ່ງລາຍລະອຽດ</Button>
        </div>
    },
    {
        orderID: <p className=' text-center'>2</p>,
        dateTime: '20/01/2025 14:34',
        table: 3,
        employee: 'Kiekie',
        tags: 'Pending',
        phone: '20 9724 1234',
        total: (190000).toLocaleString() + ' ກີບ',
        more: <div className=' flex justify-center'>
            <Button danger type="primary">ເບິ່ງລາຍລະອຽດ</Button>
        </div>
    },
    {
        orderID: <p className=' text-center'>3</p>,
        dateTime: '20/01/2025 14:34',
        table: 6,
        employee: 'Kiekie',
        tags: 'Pending',
        phone: '20 9724 1111',
        total: (190000).toLocaleString() + ' ກີບ',
        more: <div className=' flex justify-center'>
            <Button danger type="primary">ເບິ່ງລາຍລະອຽດ</Button>
        </div>
    },

];

const TableDashboard = () => {
    return (
        <div>
            <Table columns={columns} dataSource={data} />
        </div>
    )
}

export default TableDashboard