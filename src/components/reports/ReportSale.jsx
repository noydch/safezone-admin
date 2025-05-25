import React, { useEffect, useState } from 'react'
import { reportOrderApi } from '../../api/reports'
import { Table, DatePicker, Space } from 'antd';
import { Page, Text, View, Document, StyleSheet, PDFDownloadLink, Font } from '@react-pdf/renderer';
import NotoSansLaoFont from '../../fonts/NOTOSANSLAO-MEDIUM.TTF';
import moment from 'moment';

// Destructure RangePicker from DatePicker
const { RangePicker } = DatePicker;

// ลงทะเบียนฟอนต์ลาว
Font.register({
    family: 'NotoSansLao',
    src: NotoSansLaoFont
});

// สร้าง styles สำหรับ PDF
const styles = StyleSheet.create({
    page: {
        flexDirection: 'column',
        padding: 40,
        fontFamily: 'NotoSansLao',
    },
    title: {
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 20,
        fontFamily: 'NotoSansLao',
        padding: 10,
    },
    table: {
        display: 'table',
        width: '100%',
        borderStyle: 'solid',
        borderWidth: 1,
        borderColor: '#bfbfbf',
    },
    tableRow: {
        flexDirection: 'row',
        width: '100%',
    },
    tableColHeader: {
        borderStyle: 'solid',
        borderWidth: 1,
        borderColor: '#bfbfbf',
        backgroundColor: '#f0f0f0',
        padding: 6,
    },
    tableCol: {
        borderStyle: 'solid',
        borderWidth: 1,
        borderColor: '#bfbfbf',
        padding: 6,
    },
    colNo: { width: '10%' },
    colDate: { width: '20%' },
    colItems: { width: '15%' },
    colTotal: { width: '20%' },
    colPayment: { width: '15%' },
    colStatus: { width: '20%' },
    tableCell: {
        fontSize: 10,
        fontFamily: 'NotoSansLao',
    },
    header: {
        marginBottom: 20,
    },
    headerText: {
        fontSize: 12,
        marginBottom: 5,
        fontFamily: 'NotoSansLao',
    },
    summaryText: {
        fontSize: 12,
        marginBottom: 5,
        fontFamily: 'NotoSansLao',
        color: '#1890ff',
    }
});

const SaleReportPDF = ({ orders, totalOrders, totalRevenue, totalItemsSold, dateRange }) => (
    <Document>
        <Page size="A4" style={styles.page}>
            <View style={styles.header}>
                <Text style={styles.title}>ລາຍງານການຂາຍ</Text>
                <Text style={styles.headerText}>
                    ວັນທີພິມ: {moment().format('DD/MM/YYYY')} ເວລາ: {moment().format('HH:mm:ss')}
                </Text>
                {dateRange[0] && dateRange[1] && (
                    <Text style={styles.headerText}>
                        ຊ່ວງວັນທີ: {dateRange[0]} ຫາ {dateRange[1]}
                    </Text>
                )}
                <Text style={styles.summaryText}>ຈຳນວນອໍເດີທັງໝົດ: {totalOrders} ລາຍການ</Text>
                <Text style={styles.summaryText}>ຈຳນວນສິນຄ້າທີ່ຂາຍໄດ້: {totalItemsSold} ລາຍການ</Text>
                <Text style={styles.summaryText}>ລາຍຮັບທັງໝົດ: {totalRevenue?.toLocaleString()} ກີບ</Text>
            </View>

            <View style={styles.table}>
                <View style={styles.tableRow}>
                    <View style={{ ...styles.tableColHeader, ...styles.colNo }}>
                        <Text style={styles.tableCell}>ລຳດັບ</Text>
                    </View>
                    <View style={{ ...styles.tableColHeader, ...styles.colDate }}>
                        <Text style={styles.tableCell}>ວັນທີ/ເວລາ</Text>
                    </View>
                    <View style={{ ...styles.tableColHeader, ...styles.colItems }}>
                        <Text style={styles.tableCell}>ຈຳນວນລາຍການ</Text>
                    </View>
                    <View style={{ ...styles.tableColHeader, ...styles.colTotal }}>
                        <Text style={styles.tableCell}>ລາຄາລວມ</Text>
                    </View>
                    <View style={{ ...styles.tableColHeader, ...styles.colPayment }}>
                        <Text style={styles.tableCell}>ການຊຳລະ</Text>
                    </View>
                    <View style={{ ...styles.tableColHeader, ...styles.colStatus }}>
                        <Text style={styles.tableCell}>ຜູ້ຂາຍ</Text>
                    </View>
                </View>

                {orders.map((order, index) => {
                    const totalItems = order.orderRounds.reduce((sum, round) =>
                        sum + round.orderDetails.reduce((roundSum, detail) =>
                            roundSum + detail.quantity, 0), 0);

                    return (
                        <View style={styles.tableRow} key={index}>
                            <View style={{ ...styles.tableCol, ...styles.colNo }}>
                                <Text style={styles.tableCell}>{index + 1}</Text>
                            </View>
                            <View style={{ ...styles.tableCol, ...styles.colDate }}>
                                <Text style={styles.tableCell}>
                                    {moment(order.orderDate).format('DD/MM/YYYY HH:mm')}
                                </Text>
                            </View>
                            <View style={{ ...styles.tableCol, ...styles.colItems }}>
                                <Text style={styles.tableCell}>{totalItems}</Text>
                            </View>
                            <View style={{ ...styles.tableCol, ...styles.colTotal }}>
                                <Text style={styles.tableCell}>
                                    {order.total_price?.toLocaleString()} ກີບ
                                </Text>
                            </View>
                            <View style={{ ...styles.tableCol, ...styles.colPayment }}>
                                <Text style={styles.tableCell}>{order.payment_method}</Text>
                            </View>
                            <View style={{ ...styles.tableCol, ...styles.colStatus }}>
                                <Text style={styles.tableCell}>
                                    {order.employee?.fname} {order.employee?.lname}
                                </Text>
                            </View>
                        </View>
                    );
                })}
            </View>
        </Page>
    </Document>
);

const ReportSale = () => {
    const [orderData, setOrderData] = useState({
        totalOrders: 0,
        totalRevenue: 0,
        totalItemsSold: 0,
        orders: []
    });
    const [selectedDateRange, setSelectedDateRange] = useState([null, null]);
    const [filteredData, setFilteredData] = useState({
        totalOrders: 0,
        totalRevenue: 0,
        totalItemsSold: 0,
        orders: []
    });

    const fetchData = async () => {
        try {
            const response = await reportOrderApi();
            setOrderData(response.data);
            setFilteredData(response.data);
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        fetchData();
    }, []);

    // เพิ่มฟังก์ชันจัดการการเปลี่ยนแปลงวันที่
    const onChange = (dates, dateStrings) => {
        setSelectedDateRange(dateStrings);

        if (dateStrings[0] && dateStrings[1]) {
            const filteredOrders = orderData.orders.filter(order => {
                const orderDate = moment(order.orderDate).format('YYYY-MM-DD');
                return orderDate >= dateStrings[0] && orderDate <= dateStrings[1];
            });

            // คำนวณค่ารวมใหม่สำหรับข้อมูลที่กรอง
            const totalRevenue = filteredOrders.reduce((sum, order) => sum + (order.total_price || 0), 0);
            const totalItemsSold = filteredOrders.reduce((sum, order) =>
                sum + (order.orderDetails?.length || 0), 0);

            setFilteredData({
                orders: filteredOrders,
                totalOrders: filteredOrders.length,
                totalRevenue: totalRevenue,
                totalItemsSold: totalItemsSold
            });
        } else {
            setFilteredData(orderData); // ถ้าไม่ได้เลือกวันที่ ให้แสดงข้อมูลทั้งหมด
        }
    };

    const columns = [
        {
            title: 'ລຳດັບ',
            key: 'index',
            width: 80,
            render: (_, __, index) => index + 1
        },
        {
            title: 'ວັນທີ/ເວລາ',
            dataIndex: 'orderDate',
            key: 'orderDate',
            width: 150,
            render: (date) => moment(date).format('DD/MM/YYYY HH:mm')
        },
        {
            title: 'ຈຳນວນລາຍການ',
            key: 'items',
            width: 120,
            render: (record) => {
                const totalItems = record.orderRounds.reduce((sum, round) =>
                    sum + round.orderDetails.reduce((roundSum, detail) =>
                        roundSum + detail.quantity, 0), 0);
                return (
                    <div className="bg-yellow-100 text-center py-1 px-2 rounded">
                        {totalItems}
                    </div>
                );
            }
        },
        {
            title: 'ລາຄາລວມ',
            dataIndex: 'total_price',
            key: 'total_price',
            width: 120,
            render: (price) => `${price?.toLocaleString()} ກີບ`
        },
        {
            title: 'ການຊຳລະ',
            dataIndex: 'payment_method',
            key: 'payment_method',
            width: 100,
            render: (method) => (
                <div className={`text-center py-1 px-2 rounded ${method === 'CASH' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'}`}>
                    {method || 'N/A'}
                </div>
            )
        },
        {
            title: 'ຜູ້ຂາຍ',
            key: 'employee',
            width: 120,
            render: (record) => (
                <div className="bg-gray-100 text-gray-800 text-center py-1 px-2 rounded">
                    {record.employee?.fname} {record.employee?.lname}
                </div>
            )
        }
    ];

    return (
        <div className='bg-white rounded-md p-4'>
            <div className='flex items-center justify-between mb-4'>
                <div>
                    <h2 className='text-xl font-bold mb-2'>ລາຍງານການຂາຍ</h2>
                    <div className='flex items-center gap-x-2 mb-4'>
                        <p>ເລືອກຊ່ວງວັນທີ : </p>
                        <Space direction="vertical">
                            <RangePicker
                                format="YYYY-MM-DD"
                                onChange={onChange}
                                allowClear={true}
                            />
                        </Space>
                    </div>
                </div>
                <PDFDownloadLink
                    document={
                        <SaleReportPDF
                            orders={filteredData.orders}
                            totalOrders={filteredData.totalOrders}
                            totalRevenue={filteredData.totalRevenue}
                            totalItemsSold={filteredData.totalItemsSold}
                            dateRange={selectedDateRange}
                        />
                    }
                    fileName={`ລາຍງານການຂາຍ${selectedDateRange[0] && selectedDateRange[1] ? `_${selectedDateRange[0]}_to_${selectedDateRange[1]}` : ''}.pdf`}
                    className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                >
                    {({ loading }) =>
                        loading ? 'ກຳລັງໂຫຼດ...' : 'Export PDF'
                    }
                </PDFDownloadLink>
            </div>
            <Table
                dataSource={filteredData.orders}
                columns={columns}
                pagination={{ pageSize: 10 }}
                rowKey="id"
                bordered
            />
        </div>
    )
}

export default ReportSale