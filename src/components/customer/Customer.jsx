import React from 'react'
import { Table, Button, Space } from 'antd'

const Customer = () => {
    // Sample data - you can replace this with your actual data
    const dataSource = [
        {
            key: '1',
            name: 'ທ. ສົມສະໄໝ',
            phone: '020 XXXX XXXX',
        },
        {
            key: '2',
            name: 'ນ. ສົມໃຈ',
            phone: '030 XXXX XXXX',
        },
    ];

    // Define columns for the table
    const columns = [
        {
            title: 'ລຳດັບ',
            key: 'index',
            width: '10%',
            render: (_, __, index) => index + 1,
        },
        {
            title: 'ຊື່ລູກຄ້າ',
            dataIndex: 'name',
            key: 'name',
            width: '35%',
        },
        {
            title: 'ເບີໂທ',
            dataIndex: 'phone',
            key: 'phone',
            width: '35%',
        },
        {
            title: 'ຈັດການ',
            key: 'action',
            width: '20%',
            render: (_, record) => (
                <Space size="middle">
                    <Button type="primary" onClick={() => handleEdit(record)}>
                        ແກ້ໄຂ
                    </Button>
                    <Button type="primary" danger onClick={() => handleDelete(record)}>
                        ລຶບ
                    </Button>
                </Space>
            ),
        },
    ];

    // Add handler functions
    const handleEdit = (record) => {
        console.log('Edit:', record);
        // Add your edit logic here
    };

    const handleDelete = (record) => {
        console.log('Delete:', record);
        // Add your delete logic here
    };

    return (
        <div>
            <h1 className='text-[20px] font-semibold mb-2'>ຂໍ້ມູນລູກຄ້າ</h1>
            <div className=' bg-white p-4 rounded-md '>
                <div className="max-w-[1000px]">
                    <Table dataSource={dataSource} columns={columns} />
                </div>
            </div>
        </div>
    )
}

export default Customer