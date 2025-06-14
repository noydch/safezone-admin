import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom'; // Import useParams and Link
import { Table, Spin, Alert, message, Typography, Breadcrumb } from 'antd'; // Added Typography, Breadcrumb
import axios from 'axios';
import ApiPath from '../../api/apiPath'; // Adjust path if necessary
import moment from 'moment'; // For potential date formatting if needed
import Sidebar from '../sidebar/Sidebar';

const { Title, Text } = Typography;

const ImportDetail = () => {
    const { id } = useParams();
    const [details, setDetails] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [importData, setImportData] = useState(null);

    const fetchDetails = useCallback(async () => {
        if (!id) return;
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get(`${ApiPath.getImportDetail}/${id}`);
            setImportData(response.data);
            const formattedData = response.data.details.map(detail => ({
                key: detail.id,
                drinkName: detail.drink.name,
                quantity: detail.quantity,
                price: detail.price,
                totalPrice: detail.quantity * detail.price
            }));
            setDetails(formattedData);
        } catch (err) {
            console.error(`Error fetching import details for ID ${id}:`, err);
            setError('ບໍ່ສາມາດໂຫຼດຂໍ້ມູນລາຍລະອຽດການນຳເຂົ້າໄດ້');
            message.error('ບໍ່ສາມາດໂຫຼດຂໍ້ມູນລາຍລະອຽດການນຳເຂົ້າໄດ້');
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        fetchDetails();
    }, [fetchDetails]);

    // ປັບປຸງ columns ໃຫ້ກົງກັບໂຄງສ້າງຂໍ້ມູນໃໝ່
    const columns = [
        {
            title: 'ລຳດັບ',
            key: 'index',
            render: (_, __, index) => index + 1,
            width: 80,
        },
        {
            title: 'ຊື່ເຄື່ອງດື່ມ',
            dataIndex: 'drinkName',
            key: 'drinkName',
            width: 200,
        },
        {
            title: 'ຈຳນວນ',
            dataIndex: 'quantity',
            key: 'quantity',
            width: 120,
            align: 'right',
            render: (quantity) => quantity.toLocaleString(),
        },
        {
            title: 'ລາຄາຕໍ່ໜ່ວຍ',
            dataIndex: 'price',
            key: 'price',
            width: 150,
            align: 'right',
            render: (price) => `${price.toLocaleString()} ກີບ`,
        },
        {
            title: 'ລາຄາລວມ',
            dataIndex: 'totalPrice',
            key: 'totalPrice',
            width: 150,
            align: 'right',
            render: (total) => `${total.toLocaleString()} ກີບ`,
        },
    ];

    // ຄຳນວນລາຄາລວມທັງໝົດ
    const overallTotal = details.reduce((sum, item) => sum + item.totalPrice, 0);

    if (loading) {
        return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}><Spin size="large" /></div>;
    }

    if (error) {
        return (
            <div className='bg-white p-4 rounded-md'>
                <Breadcrumb style={{ marginBottom: 16 }}>
                    <Breadcrumb.Item><Link to="/import-buy">ລາຍການນຳເຂົ້າ</Link></Breadcrumb.Item>
                    <Breadcrumb.Item>ລາຍລະອຽດ</Breadcrumb.Item>
                </Breadcrumb>
                <Alert message="Error" description={error} type="error" showIcon />
            </div>
        );
    }

    return (
        <Sidebar>
            <div className='bg-white p-4 rounded-md'>
                <Breadcrumb style={{ marginBottom: 16 }}>
                    <Breadcrumb.Item><Link to="/import-buy">ລາຍການນຳເຂົ້າ</Link></Breadcrumb.Item>
                    <Breadcrumb.Item>ລາຍລະອຽດການນຳເຂົ້າ #{id}</Breadcrumb.Item>
                </Breadcrumb>
                <Title level={3}>ລາຍລະອຽດການນຳເຂົ້າ #{id}</Title>
                <div className="mb-4">
                    <Text strong>ຜູ້ສະໜອງ: </Text>
                    <Text>{importData?.supplier.name}</Text>
                    <br />
                    <Text strong>ເບີໂທ: </Text>
                    <Text>{importData?.supplier.phone}</Text>
                    <br />
                    <Text strong>ວັນທີນຳເຂົ້າ: </Text>
                    <Text>{moment(importData?.importDate).format('DD/MM/YYYY HH:mm')}</Text>
                </div>
                <Table
                    dataSource={details}
                    columns={columns}
                    pagination={false}
                    bordered
                    summary={() => (
                        <Table.Summary.Row>
                            <Table.Summary.Cell index={0} colSpan={4}><Text strong>ລວມທັງໝົດ:</Text></Table.Summary.Cell>
                            <Table.Summary.Cell index={1} align="right">
                                <Text strong>{importData?.totalPrice.toLocaleString()} ກີບ</Text>
                            </Table.Summary.Cell>
                        </Table.Summary.Row>
                    )}
                />
            </div>
        </Sidebar>
    );
};

export default ImportDetail;