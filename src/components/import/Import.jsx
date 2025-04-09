import { Tabs, Table, Button, Tag, Space } from 'antd';
import React, { useState, useEffect } from 'react';
import { RightOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import ApiPath from '../../api/apiPath';
import axios from 'axios';

const Import = () => {
    const navigate = useNavigate();
    const [importData, setImportData] = useState([]);
    const [loading, setLoading] = useState(false);

    // Fetch import data
    const fetchImportData = async () => {
        try {
            setLoading(true);
            const response = await axios.get(ApiPath.getImport);
            const formattedData = response.data.map((item, index) => ({
                key: item.id,
                order: index + 1,
                date: new Date(item.importDate).toLocaleDateString(),
                time: new Date(item.importDate).toLocaleTimeString(),
                supplier: item.purchaseOrder?.supplier?.name || '-',
                phoneNumber: item.purchaseOrder?.supplier?.phone || '-',
                importQuantity: item.purchaseOrder?.details?.reduce((sum, detail) => sum + detail.quantity, 0) || 0,
                total: `${item.totalPrice.toLocaleString()} ກີບ`,
                status: item.status === 'pending' ? 'ລໍຖ້າຢືນຢັນ' :
                    item.status === 'approved' ? 'ອະນຸມັດແລ້ວ' :
                        item.status === 'rejected' ? 'ຖືກປະຕິເສດ' : item.status
            }));
            setImportData(formattedData);
        } catch (error) {
            console.error('Error fetching import data:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchImportData();
    }, []);

    const onChange = (key) => {
        console.log(key);
    };

    const items = [
        {
            key: '1',
            label: 'ການສັ່ງຊື້',
            // children: 'Content of Tab Pane 1',
        },
        {
            key: '2',
            label: 'ການນຳເຂົ້າ',
            // children: 'Content of Tab Pane 2',
        },
    ];

    // Table columns definition
    const columns = [
        {
            title: 'ລຳດັບ',
            dataIndex: 'order',
            key: 'order',
            width: 80,
        },
        {
            title: 'ວັນທີ/ເວລານຳເຂົ້າ',
            dataIndex: 'date',
            key: 'date',
            render: (text, record) => (
                <div>
                    <div>{record.date}</div>
                    <div>{record.time}</div>
                </div>
            ),
            width: 160,
            sorter: (a, b) => new Date(a.date) - new Date(b.date),
        },
        {
            title: 'ຊື່ຜູ້ສະໜອງ',
            dataIndex: 'supplier',
            key: 'supplier',
            width: 200,
        },
        {
            title: 'ເບີໂທຜູ້ສະໜອງ',
            dataIndex: 'phoneNumber',
            key: 'phoneNumber',
            width: 150,
        },
        {
            title: 'ຈຳນວນສິນຄ້ານຳເຂົ້າ',
            dataIndex: 'importQuantity',
            key: 'importQuantity',
            width: 140,
            render: (text) => (
                <div className="bg-yellow-100 text-center py-2 px-4 rounded">{text}</div>
            ),
        },
        {
            title: 'ລາຄາລວມ',
            dataIndex: 'total',
            key: 'total',
            width: 120,
        },
        {
            title: 'ສະຖານະ',
            dataIndex: 'status',
            key: 'status',
            width: 120,
            render: (status) => {
                let color = 'blue';
                if (status === 'ລໍຖ້າຢືນຢັນ') color = 'gold';
                else if (status === 'ອະນຸມັດແລ້ວ') color = 'green';
                else if (status === 'ຖືກປະຕິເສດ') color = 'red';

                return (
                    <Tag color={color} className="px-4 py-1">
                        {status}
                    </Tag>
                );
            },
        },
        {
            title: 'ຈັດການ',
            key: 'action',
            render: (_, record) => (
                <Space size="small">
                    <Button
                        type="link"
                        className="text-amber-500 flex items-center"
                        onClick={() => navigate(`/importDetail/${record.key}`)}
                    >
                        ລາຍລະອຽດ <RightOutlined />
                    </Button>
                </Space>
            ),
            width: 150,
        },
    ];

    return (
        <div>
            <Table
                dataSource={importData}
                columns={columns}
                pagination={{ pageSize: 10 }}
                loading={loading}
                bordered
            />
        </div>
    );
};

export default Import;