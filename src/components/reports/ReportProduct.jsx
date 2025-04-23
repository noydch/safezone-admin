import React, { useEffect, useState } from 'react'
import { reportFoodDrinkApi } from '../../api/reports'
import { Table } from 'antd';
import { Page, Text, View, Document, StyleSheet, PDFDownloadLink, Font } from '@react-pdf/renderer';
import NotoSansLaoFont from '../../fonts/NOTOSANSLAO-MEDIUM.TTF';
import moment from 'moment';

// ลงทะเบียนฟอนต์ลาว
Font.register({
    family: 'NotoSansLao',
    src: NotoSansLaoFont
});

// แก้ไข styles สำหรับ PDF
const styles = StyleSheet.create({
    page: {
        flexDirection: 'column',
        padding: 40, // เพิ่ม padding ให้มี margin ที่เหมาะสม
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
        fontSize: 10,
    },
    tableCol: {
        borderStyle: 'solid',
        borderWidth: 1,
        borderColor: '#bfbfbf',
        padding: 6,
    },
    // ปรับสัดส่วนความกว้างคอลัมน์ให้เหมาะกับ A4
    colNo: {
        width: '12%', // ลำดับ
    },
    colName: {
        width: '38%', // ชื่อสินค้า
    },
    colCategory: {
        width: '25%', // ประเภท
    },
    colPrice: {
        width: '25%', // ราคา
    },
    tableCell: {
        fontSize: 10,
        fontFamily: 'NotoSansLao',
    },
    // เพิ่ม style สำหรับส่วนหัวรายงาน
    header: {
        marginBottom: 20,
    },
    headerText: {
        fontSize: 12,
        marginBottom: 5,
        fontFamily: 'NotoSansLao',
    }
});

// แก้ไข Component PDF
const ProductReportPDF = ({ products }) => (
    <Document>
        <Page size="A4" style={styles.page}>
            <View style={styles.header}>
                <Text style={styles.title}>ລາຍງານລາຍການອາຫານ ແລະ ເຄື່ອງດື່ມ</Text>
                <Text style={styles.headerText}>
                    ວັນທີພິມ: {moment().format('DD/MM/YYYY')} ເວລາ: {moment().format('HH:mm:ss')}
                </Text>
                <Text style={styles.headerText}>ຈຳນວນລາຍການທັງໝົດ: {products.length} ລາຍການ</Text>
            </View>

            <View style={styles.table}>
                {/* หัวตาราง */}
                <View style={styles.tableRow}>
                    <View style={{ ...styles.tableColHeader, ...styles.colNo }}>
                        <Text style={styles.tableCell}>ລຳດັບ</Text>
                    </View>
                    <View style={{ ...styles.tableColHeader, ...styles.colName }}>
                        <Text style={styles.tableCell}>ຊື່ສິນຄ້າ</Text>
                    </View>
                    <View style={{ ...styles.tableColHeader, ...styles.colCategory }}>
                        <Text style={styles.tableCell}>ປະເພດ</Text>
                    </View>
                    <View style={{ ...styles.tableColHeader, ...styles.colPrice }}>
                        <Text style={styles.tableCell}>ລາຄາ</Text>
                    </View>
                </View>

                {/* ข้อมูลในตาราง */}
                {products.map((item, index) => (
                    <View style={styles.tableRow} key={index}>
                        <View style={{ ...styles.tableCol, ...styles.colNo }}>
                            <Text style={styles.tableCell}>{index + 1}</Text>
                        </View>
                        <View style={{ ...styles.tableCol, ...styles.colName }}>
                            <Text style={styles.tableCell}>{item.name}</Text>
                        </View>
                        <View style={{ ...styles.tableCol, ...styles.colCategory }}>
                            <Text style={styles.tableCell}>{item.category}</Text>
                        </View>
                        <View style={{ ...styles.tableCol, ...styles.colPrice }}>
                            <Text style={styles.tableCell}>{Number(item.price).toLocaleString()} ກີບ</Text>
                        </View>
                    </View>
                ))}
            </View>
        </Page>
    </Document>
);

const ReportProduct = () => {
    const [menu, setMenu] = useState({ foods: [], drinks: [] })

    const fetchData = async () => {
        try {
            const response = await reportFoodDrinkApi()
            setMenu(response?.data)
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        fetchData()
    }, [])

    // Combine foods and drinks into one array with category name
    const combinedData = [
        ...menu.foods.map(item => ({ ...item, category: item.category?.name })),
        ...menu.drinks.map(item => ({ ...item, category: item.Category?.name }))
    ];

    const columns = [
        {
            title: 'ລຳດັບ',
            key: 'index',
            width: 80,
            render: (_, __, index) => index + 1
        },
        {
            title: 'ຮູບພາບ',
            dataIndex: 'imageUrl',
            key: 'imageUrl',
            width: 100,
            render: (imageUrl) => (
                <img
                    src={imageUrl}
                    alt="Product"
                    className="w-16 h-16 object-cover rounded-md"
                />
            )
        },
        {
            title: 'ຊື່ສິນຄ້າ',
            dataIndex: 'name',
            key: 'name',
            width: 200
        },
        {
            title: 'ປະເພດ',
            dataIndex: 'category',
            key: 'category',
            width: 150
        },
        {
            title: 'ລາຄາ',
            dataIndex: 'price',
            key: 'price',
            width: 120,
            render: (price) => `${Number(price).toLocaleString()} ກີບ`
        }
    ];

    return (
        <div className='bg-white rounded-md p-4'>
            <div className='flex items-center justify-between mb-4'>
                <h2 className='text-xl font-bold'>ລາຍງານລາຍການອາຫານ ແລະ ເຄື່ອງດື່ມ</h2>
                <PDFDownloadLink
                    document={<ProductReportPDF products={combinedData} />}
                    fileName="ລາຍງານລາຍການອາຫານແລະເຄື່ອງດື່ມ.pdf"
                    className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                >
                    {({ loading }) =>
                        loading ? 'ກຳລັງໂຫຼດ...' : 'Export PDF'
                    }
                </PDFDownloadLink>
            </div>
            <Table
                dataSource={combinedData}
                columns={columns}
                pagination={{ pageSize: 10 }}
                rowKey="id"
                bordered
            />
        </div>
    )
}

export default ReportProduct