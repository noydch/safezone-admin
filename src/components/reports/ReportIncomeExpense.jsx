import React, { useEffect, useState } from 'react'
import { reportIncomeExprenseApi } from '../../api/reports'
import { Table } from 'antd';
import { Page, Text, View, Document, StyleSheet, PDFDownloadLink, Font } from '@react-pdf/renderer';
import NotoSansLaoFont from '../../fonts/NOTOSANSLAO-MEDIUM.TTF';
import moment from 'moment';

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

                {data.incomeDetails.map((item, index) => (
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
                ))}
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

                {data.expenseDetails.length > 0 ? data.expenseDetails.map((item, index) => (
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

const ReportIncomeExpense = () => {
    const [data, setData] = useState({
        totalIncome: 0,
        totalExpense: 0,
        netProfit: 0,
        incomeDetails: [],
        expenseDetails: []
    });

    const fetchData = async () => {
        try {
            const response = await reportIncomeExprenseApi();
            setData(response.data);
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        fetchData();
    }, []);

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
            title: 'ຈຳນວນເງິນ',
            dataIndex: 'total_price',
            key: 'total_price',
            width: 150,
            render: (amount) => `${amount?.toLocaleString()} ກີບ`
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
            title: 'ຈຳນວນເງິນ',
            dataIndex: 'totalPrice', // เปลี่ยนเป็น totalPrice สำหรับรายจ่าย
            key: 'totalPrice',
            width: 150,
            render: (amount) => `${amount?.toLocaleString()} ກີບ`
        }
    ];

    return (
        <div className='bg-white rounded-md p-4'>
            <div className='flex items-center justify-between mb-4'>
                <div>
                    <h2 className='text-xl font-bold mb-2'>ລາຍງານລາຍຮັບ-ລາຍຈ່າຍ</h2>
                    <div className='space-y-1'>
                        <p className='text-green-500 font-medium'>ລາຍຮັບທັງໝົດ: {data.totalIncome?.toLocaleString()} ກີບ</p>
                        <p className='text-blue-500 font-medium'>ລາຍຈ່າຍທັງໝົດ: {data.totalExpense?.toLocaleString()} ກີບ</p>
                        <p className={`${data.netProfit > 0 ? 'text-orange-500' : 'text-red-500'} font-medium`}>ກຳໄລສຸດທິ: {data.netProfit?.toLocaleString()} ກີບ</p>
                    </div>
                </div>
                <PDFDownloadLink
                    document={<IncomeExpenseReportPDF data={data} />}
                    fileName="ລາຍງານລາຍຮັບ-ລາຍຈ່າຍ.pdf"
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
                        dataSource={data.incomeDetails}
                        columns={incomeColumns}
                        pagination={{ pageSize: 10 }}
                        rowKey="id"
                        bordered
                    />
                </div>

                <div>
                    <h3 className='text-lg font-semibold mb-2'>ລາຍລະອຽດລາຍຈ່າຍ</h3>
                    <Table
                        dataSource={data.expenseDetails}
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