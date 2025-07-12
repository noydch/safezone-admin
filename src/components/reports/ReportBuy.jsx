import React, { useRef, useState, useEffect, useCallback } from 'react'
import { DatePicker, Space, Table, Tag, Spin, Alert, message } from 'antd';
import { Page, Text, View, Document, StyleSheet, PDFDownloadLink, Font } from '@react-pdf/renderer';
import NotoSansLaoFont from '../../fonts/NOTOSANSLAO-MEDIUM.TTF';
import axios from 'axios';
import ApiPath from '../../api/apiPath';
import moment from 'moment';

// ลงทะเบียนฟอนต์ลาว
Font.register({
    family: 'NotoSansLao',
    src: NotoSansLaoFont
});

// สร้าง styles สำหรับ PDF
const styles = StyleSheet.create({
    page: {
        flexDirection: 'column',
        padding: 30,
        fontFamily: 'NotoSansLao',
    },
    title: {
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 20,
        fontFamily: 'NotoSansLao',
    },
    table: {
        display: 'table',
        width: 'auto',
        borderStyle: 'solid',
        borderWidth: 1,
        borderColor: '#bfbfbf',
    },
    tableRow: {
        flexDirection: 'row',
    },
    tableColHeader: {
        // width: '16.66%', // Changed from '12.5%' // เดิม
        width: 'auto', // เปลี่ยนเป็น auto
        borderStyle: 'solid',
        borderWidth: 1,
        borderColor: '#bfbfbf',
        backgroundColor: '#f0f0f0',
        padding: 5,
    },
    tableCol: {
        // width: '16.66%', // Changed from '12.5%' // เดิม
        width: 'auto', // เปลี่ยนเป็น auto
        borderStyle: 'solid',
        borderWidth: 1,
        borderColor: '#bfbfbf',
        padding: 5,
    },
    tableCell: {
        fontSize: 10,
        fontFamily: 'NotoSansLao',
    }
});

// สร้าง Component สำหรับ PDF
const PurchaseOrderPDF = ({ purchaseOrders }) => (
    <Document>
        <Page size="A4" style={styles.page}> {/* ลบ orientation="landscape" ออก */}
            <Text style={styles.title}>ລາຍງານການສັ່ງຊື້ເຄື່ອງດື່ມ</Text>

            <View style={styles.table}>
                {/* หัวตาราง */}
                <View style={styles.tableRow}>
                    <View style={{ ...styles.tableColHeader, width: '10%' }}> {/* ลำดับ PO */}
                        <Text style={styles.tableCell}>ລຳດັບ PO</Text>
                    </View>
                    <View style={{ ...styles.tableColHeader, width: '25%' }}> {/* ชื่อผู้จัดหา */}
                        <Text style={styles.tableCell}>ຊື່ຜູ້ສະໜອງ</Text>
                    </View>
                    <View style={{ ...styles.tableColHeader, width: '15%' }}> {/* จำนวน (รายการ) */}
                        <Text style={styles.tableCell}>ຈຳນວນ (ລາຍການ)</Text>
                    </View>
                    <View style={{ ...styles.tableColHeader, width: '15%' }}> {/* ราคารวม */}
                        <Text style={styles.tableCell}>ລາຄາລວມ</Text>
                    </View>
                    <View style={{ ...styles.tableColHeader, width: '20%' }}> {/* วันที่สั่งซื้อ */}
                        <Text style={styles.tableCell}>ວັນທີສັ່ງຊື້</Text>
                    </View>
                    <View style={{ ...styles.tableColHeader, width: '15%' }}> {/* สถานะ */}
                        <Text style={styles.tableCell}>ສະຖານະ</Text>
                    </View>
                </View>

                {/* ข้อมูลในตาราง */}
                {purchaseOrders && purchaseOrders.length > 0 ? purchaseOrders.map((order) => (
                    <View style={styles.tableRow} key={order.id}>
                        <View style={{ ...styles.tableCol, width: '10%' }}>
                            <Text style={styles.tableCell}>{order.id}</Text>
                        </View>
                        <View style={{ ...styles.tableCol, width: '25%' }}>
                            <Text style={styles.tableCell}>{order.supplier?.name || 'N/A'}</Text>
                        </View>
                        <View style={{ ...styles.tableCol, width: '15%' }}>
                            <Text style={styles.tableCell}>{(order.details?.length || 0)} ລາຍການ</Text>
                        </View>
                        <View style={{ ...styles.tableCol, width: '15%' }}>
                            <Text style={styles.tableCell}>{(order.totalPrice || 0).toLocaleString()} ກີບ</Text>
                        </View>
                        <View style={{ ...styles.tableCol, width: '20%' }}>
                            <Text style={styles.tableCell}>{moment(order.orderDate).format('DD/MM/YYYY')}</Text>
                        </View>
                        <View style={{ ...styles.tableCol, width: '15%' }}>
                            <Text style={styles.tableCell}>{order.status?.toUpperCase() || 'UNKNOWN'}</Text>
                        </View>
                    </View>
                )) : (
                    <View style={styles.tableRow}>
                        <View style={{ ...styles.tableCol, width: '100%' }}>
                            <Text style={styles.tableCell}>ບໍ່ມີຂໍ້ມູນໃນຊ່ວງວັນທີທີ່ເລືອກ.</Text>
                        </View>
                    </View>
                )}
            </View>
        </Page>
    </Document>
);

const { RangePicker } = DatePicker;

const ReportBuy = () => {
    const reportRef = useRef(null);
    const [purchaseOrders, setPurchaseOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedDateRange, setSelectedDateRange] = useState([null, null]);

    const fetchPurchaseOrders = useCallback(async () => {
        console.log("Fetching purchase orders for report...");
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get(ApiPath.getPurchaseOrders);
            setPurchaseOrders(response.data.map(po => ({ ...po, key: po.id })));
        } catch (err) {
            console.error("Error fetching purchase orders:", err);
            const errorMsg = 'Failed to load purchase orders. Please try again later.';
            setError(errorMsg);
            message.error(errorMsg);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchPurchaseOrders();
    }, [fetchPurchaseOrders]);

    const columns = [
        {
            title: 'ລຳດັບ PO',
            dataIndex: 'id',
            key: 'id',
            width: 100,
        },
        {
            title: 'ຊື່ຜູ້ສະໜອງ',
            dataIndex: ['supplier', 'name'],
            key: 'supplierName',
            render: (name, record) => name || `Supplier ID: ${record.supplierId}`,
            width: 200,
        },
        {
            title: 'ຈຳນວນ (ລາຍການ)',
            dataIndex: 'details',
            key: 'itemCount',
            width: 140,
            render: (details) => (
                <div className="bg-yellow-100 text-center py-1 px-2 rounded">
                    {details?.length || 0} ລາຍການ
                </div>
            ),
        },
        {
            title: 'ລາຄາລວມ',
            dataIndex: 'totalPrice',
            key: 'totalPrice',
            width: 150,
            render: (price) => `${(price || 0).toLocaleString()} ກີບ`,
        },
        {
            title: 'ວັນທີສັ່ງຊື້',
            dataIndex: 'orderDate',
            key: 'orderDate',
            render: (text) => moment(text).format('DD/MM/YYYY HH:mm'),
            width: 160,
            sorter: (a, b) => moment(a.orderDate).unix() - moment(b.orderDate).unix(),
        },
        {
            title: 'ສະຖານະ',
            dataIndex: 'status',
            key: 'status',
            width: 120,
            render: (status) => {
                let color;
                switch (status) {
                    case 'pending': color = 'orange'; break;
                    case 'approved': color = 'green'; break;
                    case 'cancelled': color = 'red'; break;
                    default: color = 'default';
                }
                return (
                    <Tag color={color} key={status}>
                        {status?.toUpperCase() || 'UNKNOWN'}
                    </Tag>
                );
            },
            filters: [
                { text: 'Pending', value: 'pending' },
                { text: 'Approved', value: 'approved' },
                { text: 'Cancelled', value: 'cancelled' },
            ],
            onFilter: (value, record) => record.status?.indexOf(value) === 0,
        },
    ];

    const onChange = (dates, dateStrings) => {
        console.log('Selected Date Range:', dateStrings);
        setSelectedDateRange(dateStrings || [null, null]);
    };

    const filteredPurchaseOrders = selectedDateRange[0] && selectedDateRange[1]
        ? purchaseOrders.filter(order => {
            const orderDateFormatted = moment(order.orderDate).format('YYYY-MM-DD');
            return orderDateFormatted >= selectedDateRange[0] && orderDateFormatted <= selectedDateRange[1];
        })
        : purchaseOrders;

    if (loading && purchaseOrders.length === 0) {
        return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}><Spin size="large" /></div>;
    }

    return (
        <div className=' bg-white rounded-md p-4'>
            <div className='flex items-center justify-between mb-4'>
                <div className='flex items-center gap-x-2'>
                    <p>ເລືອກຊ່ວງວັນທີ : </p>
                    <Space direction="vertical">
                        <RangePicker
                            format="YYYY-MM-DD"
                            onChange={onChange}
                            allowClear={true}
                        />
                    </Space>
                </div>
                <PDFDownloadLink
                    document={<PurchaseOrderPDF purchaseOrders={filteredPurchaseOrders} />}
                    fileName={`ລາຍງານການສັ່ງຊື້${selectedDateRange[0] && selectedDateRange[1] ? `_${selectedDateRange[0]}_to_${selectedDateRange[1]}` : ''}.pdf`}
                    className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                >
                    {({ loading: pdfLoading }) =>
                        pdfLoading ? 'ກຳລັງໂຫຼດ...' : 'Export PDF'
                    }
                </PDFDownloadLink>
            </div>

            {error && <Alert message="Error" description={error} type="error" showIcon style={{ marginBottom: 16 }} />}

            <Table
                columns={columns}
                dataSource={filteredPurchaseOrders}
                rowKey="id"
                loading={loading}
                bordered
                pagination={{ pageSize: 10 }}
            />
        </div>
    )
}

export default ReportBuy