import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom'; // Import useParams and Link
import { Table, Spin, Alert, message, Typography, Breadcrumb } from 'antd'; // Added Typography, Breadcrumb
import axios from 'axios';
import ApiPath from '../../api/apiPath'; // Adjust path if necessary
import moment from 'moment'; // For potential date formatting if needed
import Sidebar from '../sidebar/Sidebar';

const { Title, Text } = Typography;

const BuyDetail = () => {
    const { id } = useParams(); // Changed from purchaseOrderId to id
    const [details, setDetails] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [purchaseOrderData, setPurchaseOrderData] = useState(null);
    // Optional: State to store PO header info if needed later
    // const [purchaseOrderInfo, setPurchaseOrderInfo] = useState(null);

    const fetchDetails = useCallback(async () => {
        if (!id) return;
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get(`${ApiPath.getPurchaseOrderById}/${id}`);
            setPurchaseOrderData(response.data);
            setDetails(response.data.details.map(detail => ({
                ...detail,
                key: detail.id,
                drinkName: detail.productUnit?.drink?.name || '-',
                unitName: detail.productUnit?.name || '-'
            })));
        } catch (err) {
            console.error(`Error fetching details for PO ID ${id}:`, err);
            setError('ບໍ່ສາມາດໂຫຼດຂໍ້ມູນລາຍລະອຽດການສັ່ງຊື້ໄດ້');
            message.error('ບໍ່ສາມາດໂຫຼດຂໍ້ມູນລາຍລະອຽດການສັ່ງຊື້ໄດ້');
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        fetchDetails();
    }, [fetchDetails]);

    // Define columns for the details table
    const columns = [
        {
            title: 'ລຳດັບລາຍການ',
            key: 'index',
            render: (_, __, index) => index + 1,
            width: 100,
        },
        {
            title: 'ເຄື່ອງດື່ມ',
            dataIndex: 'drinkName',
            key: 'drinkName',
            width: 200,
        },
        {
            title: 'ຫົວໜ່ວຍ',
            dataIndex: 'unitName',
            key: 'unitName',
            width: 200,
        },
        {
            title: 'ຈຳນວນ',
            dataIndex: 'quantity',
            key: 'quantity',
            align: 'right',
            width: 120,
            render: (quantity) => quantity.toLocaleString(),
        },
        {
            title: 'ລາຄາຕໍ່ໜ່ວຍ',
            dataIndex: 'price',
            key: 'price',
            align: 'right',
            width: 150,
            render: (price) => `${price.toLocaleString()} ກີບ`,
        },
        {
            title: 'ລາຄາລວມ',
            key: 'totalItemPrice',
            align: 'right',
            width: 180,
            render: (_, record) => {
                const total = record.quantity * record.price;
                return `${total.toLocaleString()} ກີບ`;
            },
        },
        // Add other relevant columns from PurchaseOrderDetail if needed
    ];

    // Calculate overall total price from details (optional, PO header might have it)
    const overallTotalPrice = details.reduce((sum, item) => sum + (item.quantity * item.price), 0);

    if (loading) {
        return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}><Spin size="large" /></div>;
    }

    if (error) {
        return (
            <div className='bg-white p-4 rounded-md'>
                <Breadcrumb style={{ marginBottom: 16 }}>
                    <Breadcrumb.Item><Link to="/import-buy">ລາຍການສັ່ງຊື້</Link></Breadcrumb.Item>
                    <Breadcrumb.Item>ລາຍລະອຽດ</Breadcrumb.Item>
                </Breadcrumb>
                <Alert message="Error Loading Data" description={error} type="error" showIcon />
            </div>
        );
    }

    return (
        <Sidebar>
            <div className=' bg-white p-4 rounded-md '>
                <Breadcrumb style={{ marginBottom: 16 }}>
                    <Breadcrumb.Item><Link to="/import-buy">ລາຍການສັ່ງຊື້</Link></Breadcrumb.Item> {/* Adjust link if route is different */}
                    <Breadcrumb.Item>ລາຍລະອຽດ PO #{id}</Breadcrumb.Item> {/* Use id */}
                </Breadcrumb>
                <Title level={3}>ລາຍລະອຽດການສັ່ງຊື້ #{id}</Title> {/* Use id */}

                {/* แสดงข้อมูล PO header */}
                <div className="mb-4">
                    <Text strong>ຜູ້ສະໜອງ: </Text>
                    <Text>{purchaseOrderData?.supplier?.name}</Text>
                    <br />
                    <Text strong>ເບີໂທ: </Text>
                    <Text>{purchaseOrderData?.supplier?.phone}</Text>
                    <br />
                    <Text strong>ວັນທີສັ່ງຊື້: </Text>
                    <Text>{moment(purchaseOrderData?.orderDate).format('DD/MM/YYYY HH:mm')}</Text>
                    <br />
                    <Text strong>ສະຖານະ: </Text>
                    <Text>{purchaseOrderData?.status === 'approved' ? 'ອະນຸມັດແລ້ວ' :
                        purchaseOrderData?.status === 'cancelled' ? 'ຍົກເລີກ' :
                            purchaseOrderData?.status === 'pending' ? 'ລໍຖ້າຢືນຢັນ' :
                                purchaseOrderData?.status}</Text>
                </div>

                <Table
                    dataSource={details}
                    columns={columns}
                    pagination={false} // Typically don't need pagination for details view
                    bordered
                    summary={() => (
                        <Table.Summary.Row>
                            <Table.Summary.Cell index={0} colSpan={5}><Text strong>ລວມທັງໝົດ:</Text></Table.Summary.Cell>
                            <Table.Summary.Cell index={1} align="right"><Text strong>{purchaseOrderData?.totalPrice.toLocaleString()} ກີບ</Text></Table.Summary.Cell>
                        </Table.Summary.Row>
                    )}
                />
            </div>
        </Sidebar>
    );
};

export default BuyDetail;