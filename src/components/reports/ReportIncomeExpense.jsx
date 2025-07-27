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
    colNo: { width: '10%' }, // ลดความกว้าง
    colDate: { width: '25%' }, // ลดความกว้าง
    colTable: { width: '15%' }, // เพิ่มสำหรับคอลัมน์ "ໂຕະ"
    colEmployee: { width: '25%' }, // เพิ่มสำหรับคอลัมน์ "ພະນັກງານ"
    colSupplier: { width: '30%' }, // เพิ่มคอลัมน์ผู้จัดหา
    colAmount: { width: '25%' }, // ปรับลดความกว้าง
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
                    <View style={{ ...styles.tableColHeader, ...styles.colTable }}> {/* เพิ่ม โຕະ */}
                        <Text style={styles.tableCell}>ໂຕະ</Text>
                    </View>
                    <View style={{ ...styles.tableColHeader, ...styles.colEmployee }}> {/* เพิ่ม ພະນັກງານ */}
                        <Text style={styles.tableCell}>ພະນັກງານ</Text>
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
                        <View style={{ ...styles.tableCol, ...styles.colTable }}> {/* เพิ่ม item.tableNumber */}
                            <Text style={styles.tableCell}>{item.tableNumber ?? ''}</Text>
                        </View>
                        <View style={{ ...styles.tableCol, ...styles.colEmployee }}> {/* เพิ่ม item.employee */}
                            <Text style={styles.tableCell}>{item.employee ?? ''}</Text>
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
                    <View style={{ ...styles.tableColHeader, ...styles.colSupplier }}> {/* เพิ่มคอลัมน์ผู้จัดหา */}
                        <Text style={styles.tableCell}>ຜູ້ສະໜອງ</Text>
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
                        <View style={{ ...styles.tableCol, ...styles.colSupplier }}> {/* เพิ่มข้อมูลผู้จัดหา */}
                            <Text style={styles.tableCell}>{item.supplier ?? ''}</Text>
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
    const [originalIncomeDetails, setOriginalIncomeDetails] = useState([]); // State to hold all income data (now will be filtered drinks)
    const [originalExpenseDetails, setOriginalExpenseDetails] = useState([]); // State to hold all expense data

    // เพิ่มฟังก์ชันคำนวณผลรวม
    const calculateTotals = (incomeData, expenseData) => {
        const totalIncome = incomeData.reduce((sum, item) => sum + (item.total_price || 0), 0);
        const totalExpense = expenseData.reduce((sum, item) => sum + (item.totalPrice || 0), 0);
        const netProfit = totalIncome - totalExpense;
        return { totalIncome, totalExpense, netProfit };
    };

    // แก้ไขฟังก์ชัน fetchData เพื่อดึงข้อมูลเฉพาะเครื่องดื่ม
    const fetchData = async () => {
        try {
            const token = localStorage.getItem('token');

            // ดึงข้อมูลรายรับ (orders) ทั้งหมด
            const ordersResponse = await getAllOrdersApi(token);
            const allOrders = ordersResponse.data;

            // กรองและคำนวณเฉพาะรายการเครื่องดื่มจาก orders
            const incomeDetailsFromDrinks = [];

            allOrders.forEach(order => {
                let drinkTotalPriceForOrder = 0;
                let hasDrinkItemsInOrder = false; // Flag to check if this order contains any drink items

                // วนลูปผ่าน orderRounds
                if (order.orderRounds && Array.isArray(order.orderRounds)) {
                    order.orderRounds.forEach(round => {
                        // วนลูปผ่าน orderDetails ในแต่ละ round
                        if (round.orderDetails && Array.isArray(round.orderDetails)) {
                            round.orderDetails.forEach(detail => {
                                // ตรวจสอบว่าเป็นรายการเครื่องดื่มหรือไม่ โดยดูจาก productUnit และ categoryId
                                console.log('Checking detail:', detail);
                                if (detail.productUnit && detail.productUnit.drink && detail.productUnit.drink.categoryId === 2) { // แก้ไขตรงนี้จาก 4 เป็น 2
                                    console.log('Found drink item:', detail.productUnit.name, 'Price:', detail.price, 'Quantity:', detail.quantity);
                                    drinkTotalPriceForOrder += (detail.price * detail.quantity);
                                    hasDrinkItemsInOrder = true;
                                } else {
                                    console.log('Not a drink or missing properties:', detail.productUnit?.drink?.categoryId);
                                }
                            });
                        }
                    });
                }

                // หาก order นี้มีรายการเครื่องดื่ม ให้เพิ่มเข้าใน incomeDetailsFromDrinks
                if (hasDrinkItemsInOrder) {
                    incomeDetailsFromDrinks.push({
                        id: order.id,
                        createdAt: order.createdAt,
                        total_price: drinkTotalPriceForOrder, // ราคารวมเฉพาะเครื่องดื่มในออเดอร์นี้
                        status: order.billStatus,
                        tableNumber: order.table?.table_number ?? '',
                        employee: `${order.employee?.fname ?? ''} ${order.employee?.lname ?? ''}`.trim()
                    });
                    console.log('Order with drinks processed:', order.id, 'Total drink price:', drinkTotalPriceForOrder);
                }
            });

            console.log('Final incomeDetailsFromDrinks:', incomeDetailsFromDrinks); // ดูว่ามีข้อมูลหรือไม่

            // ดึงข้อมูลรายจ่าย (imports) - ส่วนนี้ไม่มีการเปลี่ยนแปลง
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
                supplier: importItem.supplier?.name ?? ''
            }));

            // Store the original fetched data (ตอนนี้ originalIncomeDetails จะมีแต่ข้อมูลเครื่องดื่ม)
            setOriginalIncomeDetails(incomeDetailsFromDrinks);
            setOriginalExpenseDetails(expenseDetails);

            // คำนวณผลรวมโดยใช้ฟังก์ชัน calculateTotals (โดยใช้ข้อมูลรายรับเครื่องดื่ม)
            const { totalIncome, totalExpense, netProfit } = calculateTotals(incomeDetailsFromDrinks, expenseDetails);

            setData({
                period: { from: null, to: null },
                totalIncome,
                totalExpense,
                netProfit,
                incomeDetails: incomeDetailsFromDrinks, // ตั้งค่า incomeDetails เริ่มต้นเป็นข้อมูลเครื่องดื่ม
                expenseDetails: expenseDetails
            });
            setFilteredIncome(incomeDetailsFromDrinks); // ตั้งค่า filteredIncome เริ่มต้นเป็นข้อมูลเครื่องดื่ม
            setFilteredExpense(expenseDetails);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // แก้ไขฟังก์ชัน onDateChange (มีการปรับปรุงเงื่อนไขการกรองวันที่เล็กน้อยเพื่อความแม่นยำ)
    const onDateChange = (dates, dateStrings) => {
        setSelectedDateRange(dateStrings);
        if (dates && dates[0] && dates[1]) { // ตรวจสอบว่ามีวันที่เริ่มต้นและสิ้นสุดถูกเลือก
            // กรองข้อมูลรายรับ (เครื่องดื่ม) ตามช่วงวันที่
            const filteredIncomeData = (originalIncomeDetails || []).filter(item => {
                const itemDate = moment(item.createdAt);
                const startDate = moment(dateStrings[0]);
                const endDate = moment(dateStrings[1]);
                return itemDate.isBetween(startDate, endDate, 'day', '[]'); // '[]' includes start and end day
            });

            // กรองข้อมูลรายจ่ายตามช่วงวันที่
            const filteredExpenseData = (originalExpenseDetails || []).filter(item => {
                const itemDate = moment(item.createdAt);
                const startDate = moment(dateStrings[0]);
                const endDate = moment(dateStrings[1]);
                return itemDate.isBetween(startDate, endDate, 'day', '[]');
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
            // ถ้าไม่มีช่วงวันที่ที่เลือก (หรือกด Clear) ให้แสดงข้อมูลทั้งหมดจาก original (ซึ่งตอนนี้มีแต่เครื่องดื่ม)
            const { totalIncome, totalExpense, netProfit } = calculateTotals(originalIncomeDetails, originalExpenseDetails);

            setData(prev => ({
                ...prev,
                period: { from: null, to: null },
                totalIncome,
                totalExpense,
                netProfit,
                incomeDetails: originalIncomeDetails,
                expenseDetails: originalExpenseDetails
            }));

            setFilteredIncome(originalIncomeDetails || []);
            setFilteredExpense(originalExpenseDetails || []);
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