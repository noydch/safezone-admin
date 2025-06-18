import React, { useEffect, useState } from 'react'
import { reportIncomeExprenseApi } from '../../api/reports'
import { Table, DatePicker, Space, Tag } from 'antd';
import { Page, Text, View, Document, StyleSheet, PDFDownloadLink, Font } from '@react-pdf/renderer';
import NotoSansLaoFont from '../../fonts/NOTOSANSLAO-MEDIUM.TTF';
import moment from 'moment';
import { getAllOrdersApi } from '../../api/order';
import { comfirmImport } from '../../api/import';
import axios from 'axios';
import ApiPath from '../../api/apiPath';

// ลงทะเบียนฟอนต์ลาว
Font.register({
    family: 'NotoSansLao',
    src: NotoSansLaoFont
});

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
        marginTop: 10,
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
    colNo: { width: '15%' },
    colDate: { width: '45%' },
    colAmount: { width: '40%' },
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
    },
    sectionTitle: {
        fontSize: 14,
        marginTop: 15,
        marginBottom: 5,
        fontFamily: 'NotoSansLao',
    }
});

const IncomeExpenseReportPDF = ({ data }) => (
    <Document>
        <Page size="A4" style={styles.page}>
            <View style={styles.header}>
                <Text style={styles.title}>ລາຍງານລາຍຮັບ-ລາຍຈ່າຍ</Text>
                <Text style={styles.headerText}>
                    ວັນທີພິມ: {moment().format('DD/MM/YYYY')} ເວລາ: {moment().format('HH:mm:ss')}
                </Text>
                <Text style={styles.summaryText}>ລາຍຮັບທັງໝົດ: {data.totalIncome?.toLocaleString()} ກີບ</Text>
                <Text style={styles.summaryText}>ລາຍຈ່າຍທັງໝົດ: {data.totalExpense?.toLocaleString()} ກີບ</Text>
                <Text style={styles.summaryText}>ກຳໄລສຸດທິ: {data.netProfit?.toLocaleString()} ກີບ</Text>
            </View>

            {/* ตารางรายรับ */}
            <Text style={styles.sectionTitle}>ລາຍລະອຽດລາຍຮັບ</Text>
            <View style={styles.table}>
                <View style={styles.tableRow}>
                    <View style={{ ...styles.tableColHeader, ...styles.colNo }}>
                        <Text style={styles.tableCell}>ລຳດັບ</Text>
                    </View>
                    <View style={{ ...styles.tableColHeader, ...styles.colDate }}>
                        <Text style={styles.tableCell}>ວັນທີ/ເວລາ</Text>
                    </View>
                    <View style={{ ...styles.tableColHeader, ...styles.colAmount }}>
                        <Text style={styles.tableCell}>ຈຳນວນເງິນ</Text>
                    </View>
                </View>
                {(Array.isArray(data.incomeDetails) && data.incomeDetails.length > 0) ? data.incomeDetails.map((item, index) => (
                    <View style={styles.tableRow} key={index}>
                        <View style={{ ...styles.tableCol, ...styles.colNo }}>
                            <Text style={styles.tableCell}>{index + 1}</Text>
                        </View>
                        <View style={{ ...styles.tableCol, ...styles.colDate }}>
                            <Text style={styles.tableCell}>{moment(item.createdAt).format('DD/MM/YYYY HH:mm')}</Text>
                        </View>
                        <View style={{ ...styles.tableCol, ...styles.colAmount }}>
                            <Text style={styles.tableCell}>{item.total_price?.toLocaleString()} ກີບ</Text>
                        </View>
                    </View>
                )) : (
                    <View style={styles.tableRow}>
                        <View style={{ ...styles.tableCol, width: '100%' }}>
                            <Text style={styles.tableCell}>ບໍ່ມີຂໍ້ມູນ</Text>
                        </View>
                    </View>
                )}
            </View>

            {/* ตารางรายจ่าย */}
            <Text style={styles.sectionTitle}>ລາຍລະອຽດລາຍຈ່າຍ</Text>
            <View style={styles.table}>
                <View style={styles.tableRow}>
                    <View style={{ ...styles.tableColHeader, ...styles.colNo }}>
                        <Text style={styles.tableCell}>ລຳດັບ</Text>
                    </View>
                    <View style={{ ...styles.tableColHeader, ...styles.colDate }}>
                        <Text style={styles.tableCell}>ວັນທີ/ເວລາ</Text>
                    </View>
                    <View style={{ ...styles.tableColHeader, ...styles.colAmount }}>
                        <Text style={styles.tableCell}>ຈຳນວນເງິນ</Text>
                    </View>
                </View>
                {(Array.isArray(data.expenseDetails) && data.expenseDetails.length > 0) ? data.expenseDetails.map((item, index) => (
                    <View style={styles.tableRow} key={index}>
                        <View style={{ ...styles.tableCol, ...styles.colNo }}>
                            <Text style={styles.tableCell}>{index + 1}</Text>
                        </View>
                        <View style={{ ...styles.tableCol, ...styles.colDate }}>
                            <Text style={styles.tableCell}>{moment(item.createdAt).format('DD/MM/YYYY HH:mm')}</Text>
                        </View>
                        <View style={{ ...styles.tableCol, ...styles.colAmount }}>
                            <Text style={styles.tableCell}>{item.totalPrice?.toLocaleString()} ກີບ</Text>
                        </View>
                    </View>
                )) : (
                    <View style={styles.tableRow}>
                        <View style={{ ...styles.tableCol, width: '100%' }}>
                            <Text style={styles.tableCell}>ບໍ່ມີຂໍ້ມູນ</Text>
                        </View>
                    </View>
                )}
            </View>
        </Page>
    </Document>
);

const { RangePicker } = DatePicker;

const ReportIncomeExpense = () => {
    const [data, setData] = useState({
        period: { from: null, to: null },
        totalIncome: 0,
        totalExpense: 0,
        netProfit: 0,
        incomeDetails: [],
        expenseDetails: []
    });
    const [filteredIncome, setFilteredIncome] = useState([]);
    const [filteredExpense, setFilteredExpense] = useState([]);
    const [selectedDateRange, setSelectedDateRange] = useState([null, null]);

    // เพิ่มฟังก์ชันคำนวณผลรวม
    const calculateTotals = (incomeData, expenseData) => {
        const totalIncome = incomeData.reduce((sum, item) => sum + (item.total_price || 0), 0);
        const totalExpense = expenseData.reduce((sum, item) => sum + (item.totalPrice || 0), 0);
        const netProfit = totalIncome - totalExpense;
        return { totalIncome, totalExpense, netProfit };
    };

    // แก้ไขฟังก์ชัน fetchData
    const fetchData = async () => {
        try {
            const token = localStorage.getItem('token');

            // ดึงข้อมูลรายรับ (orders)
            const ordersResponse = await getAllOrdersApi(token);
            const incomeDetails = ordersResponse.data.map(order => ({
                id: order.id,
                createdAt: order.createdAt,
                total_price: order.total_price,
                status: order.billStatus,
                tableNumber: order.table?.table_number,
                employee: `${order.employee?.fname} ${order.employee?.lname}`
            }));

            // ดึงข้อมูลรายจ่าย (imports)
            const importsResponse = await axios.get(ApiPath.getImport, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            const expenseDetails = importsResponse.data.map(importItem => ({
                id: importItem.id,
                createdAt: importItem.importDate,
                totalPrice: importItem.totalPrice,
                status: importItem.status,
                supplier: importItem.supplier?.name
            }));

            // คำนวณผลรวมโดยใช้ฟังก์ชัน calculateTotals
            const { totalIncome, totalExpense, netProfit } = calculateTotals(incomeDetails, expenseDetails);

            setData({
                period: { from: null, to: null },
                totalIncome,
                totalExpense,
                netProfit,
                incomeDetails,
                expenseDetails
            });
            setFilteredIncome(incomeDetails);
            setFilteredExpense(expenseDetails);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // แก้ไขฟังก์ชัน onDateChange
    const onDateChange = (dates, dateStrings) => {
        setSelectedDateRange(dateStrings);
        if (dateStrings[0] && dateStrings[1]) {
            // กรองข้อมูลรายรับตามช่วงวันที่
            const filteredIncomeData = (data.incomeDetails || []).filter(item => {
                const date = moment(item.createdAt).format('YYYY-MM-DD');
                return date >= dateStrings[0] && date <= dateStrings[1];
            });

            // กรองข้อมูลรายจ่ายตามช่วงวันที่
            const filteredExpenseData = (data.expenseDetails || []).filter(item => {
                const date = moment(item.createdAt).format('YYYY-MM-DD');
                return date >= dateStrings[0] && date <= dateStrings[1];
            });

            // คำนวณผลรวมใหม่โดยใช้ฟังก์ชัน calculateTotals
            const { totalIncome, totalExpense, netProfit } = calculateTotals(filteredIncomeData, filteredExpenseData);

            // อัพเดทข้อมูลสรุปและข้อมูลที่กรองแล้ว
            setData(prev => ({
                ...prev,
                period: { from: dateStrings[0], to: dateStrings[1] },
                totalIncome,
                totalExpense,
                netProfit,
                incomeDetails: filteredIncomeData,
                expenseDetails: filteredExpenseData
            }));

            setFilteredIncome(filteredIncomeData);
            setFilteredExpense(filteredExpenseData);
        } else {
            // ถ้าไม่มีช่วงวันที่ที่เลือก ให้แสดงข้อมูลทั้งหมด
            const { totalIncome, totalExpense, netProfit } = calculateTotals(data.incomeDetails, data.expenseDetails);

            setData(prev => ({
                ...prev,
                period: { from: null, to: null },
                totalIncome,
                totalExpense,
                netProfit,
                incomeDetails: prev.incomeDetails,
                expenseDetails: prev.expenseDetails
            }));

            setFilteredIncome(data.incomeDetails || []);
            setFilteredExpense(data.expenseDetails || []);
        }
    };

    // คอลัมน์สำหรับรายรับ (orders)
    // คอลัมน์สำหรับรายรับ (ใช้ total_price)
    const incomeColumns = [
        {
            title: 'ລຳດັບ',
            key: 'index',
            width: 80,
            render: (_, __, index) => index + 1
        },
        {
            title: 'ວັນທີ/ເວລາ',
            dataIndex: 'createdAt',
            key: 'createdAt',
            width: 200,
            render: (date) => moment(date).format('DD/MM/YYYY HH:mm')
        },
        {
            title: 'ໂຕະ',
            dataIndex: 'tableNumber',
            key: 'tableNumber',
            width: 100,
        },
        {
            title: 'ພະນັກງານ',
            dataIndex: 'employee',
            key: 'employee',
            width: 150,
        },
        {
            title: 'ຈຳນວນເງິນ',
            dataIndex: 'total_price',
            key: 'total_price',
            width: 150,
            render: (amount) => `${amount?.toLocaleString()} ກີບ`
        },
        {
            title: 'ສະຖານະ',
            dataIndex: 'status',
            key: 'status',
            width: 120,
            render: (status) => {
                let color = 'blue';
                if (status === 'OPEN') color = 'orange';
                else if (status === 'CLOSED') color = 'green';
                return <Tag color={color}>{status}</Tag>;
            }
        }
    ];

    // คอลัมน์สำหรับรายจ่าย (ใช้ totalPrice)
    const expenseColumns = [
        {
            title: 'ລຳດັບ',
            key: 'index',
            width: 80,
            render: (_, __, index) => index + 1
        },
        {
            title: 'ວັນທີ/ເວລາ',
            dataIndex: 'createdAt',
            key: 'createdAt',
            width: 200,
            render: (date) => moment(date).format('DD/MM/YYYY HH:mm')
        },
        {
            title: 'ຜູ້ສະໜອງ',
            dataIndex: 'supplier',
            key: 'supplier',
            width: 200,
        },
        {
            title: 'ຈຳນວນເງິນ',
            dataIndex: 'totalPrice', // เปลี่ยนเป็น totalPrice สำหรับรายจ่าย
            key: 'totalPrice',
            width: 150,
            render: (amount) => `${amount?.toLocaleString()} ກີບ`
        },
        {
            title: 'ສະຖານະ',
            dataIndex: 'status',
            key: 'status',
            width: 120,
            render: (status) => {
                let color = 'blue';
                if (status === 'completed') color = 'green';
                else if (status === 'cancelled') color = 'red';
                return <Tag color={color}>{status}</Tag>;
            }
        }
    ];

    return (
        <div className='bg-white rounded-md p-4'>
            <div className='flex items-center justify-between mb-4'>
                <div>
                    <h2 className='text-xl font-bold mb-2'>ລາຍງານລາຍຮັບ-ລາຍຈ່າຍ</h2>
                    <div className='flex items-center gap-x-2 mb-2'>
                        <span>ເລືອກຊ່ວງວັນທີ:</span>
                        <Space direction="vertical">
                            <RangePicker
                                format="YYYY-MM-DD"
                                onChange={onDateChange}
                                allowClear={true}
                            />
                        </Space>
                    </div>
                    <div className='space-y-1'>
                        <p className='text-green-500 font-medium'>
                            ລາຍຮັບທັງໝົດ: {data.totalIncome?.toLocaleString()} ກີບ
                        </p>
                        <p className='text-blue-500 font-medium'>
                            ລາຍຈ່າຍທັງໝົດ: {data.totalExpense?.toLocaleString()} ກີບ
                        </p>
                        <p className={`${data.netProfit >= 0 ? 'text-orange-500' : 'text-red-500'} font-medium`}>
                            ກຳໄລສຸດທິ: {data.netProfit?.toLocaleString()} ກີບ
                        </p>
                    </div>
                </div>
                <PDFDownloadLink
                    document={<IncomeExpenseReportPDF data={data} />}
                    fileName={`ລາຍງານລາຍຮັບ-ລາຍຈ່າຍ_${moment(data.period?.from).format('DD-MM-YYYY')}_to_${moment(data.period?.to).format('DD-MM-YYYY')}.pdf`}
                    className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                >
                    {({ loading }) =>
                        loading ? 'ກຳລັງໂຫຼດ...' : 'Export PDF'
                    }
                </PDFDownloadLink>
            </div>

            <div className='space-y-6'>
                <div>
                    <h3 className='text-lg font-semibold mb-2'>ລາຍລະອຽດລາຍຮັບ</h3>
                    <Table
                        dataSource={filteredIncome}
                        columns={incomeColumns}
                        pagination={{ pageSize: 10 }}
                        rowKey="id"
                        bordered
                    />
                </div>
                <div>
                    <h3 className='text-lg font-semibold mb-2'>ລາຍລະອຽດລາຍຈ່າຍ</h3>
                    <Table
                        dataSource={filteredExpense}
                        columns={expenseColumns}
                        pagination={{ pageSize: 10 }}
                        rowKey="id"
                        bordered
                    />
                </div>
            </div>
        </div>
    )
}

export default ReportIncomeExpense