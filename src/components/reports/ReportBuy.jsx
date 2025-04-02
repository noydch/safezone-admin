import React, { useRef } from 'react'
import { DatePicker, Space, Table } from 'antd';
import { Page, Text, View, Document, StyleSheet, PDFDownloadLink, Font } from '@react-pdf/renderer';
import NotoSansLaoFont from '../../fonts/NOTOSANSLAO-MEDIUM.TTF';

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
        width: '12.5%',
        borderStyle: 'solid',
        borderWidth: 1,
        borderColor: '#bfbfbf',
        backgroundColor: '#f0f0f0',
        padding: 5,
    },
    tableCol: {
        width: '12.5%',
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
        <Page size="A4" orientation="landscape" style={styles.page}>
            <Text style={styles.title}>ລາຍງານການສັ່ງຊື້ເຄື່ອງດື່ມ</Text>

            <View style={styles.table}>
                {/* หัวตาราง */}
                <View style={styles.tableRow}>
                    <View style={styles.tableColHeader}>
                        <Text style={styles.tableCell}>ເລກທີໃບສັ່ງຊື້</Text>
                    </View>
                    <View style={styles.tableColHeader}>
                        <Text style={styles.tableCell}>ຊື່ຜູ້ສະໜອງ</Text>
                    </View>
                    <View style={styles.tableColHeader}>
                        <Text style={styles.tableCell}>ລາຍການສິນຄ້າ</Text>
                    </View>
                    <View style={styles.tableColHeader}>
                        <Text style={styles.tableCell}>ຈຳນວນ</Text>
                    </View>
                    <View style={styles.tableColHeader}>
                        <Text style={styles.tableCell}>ລາຄາຕໍ່ຫົວໜ່ວຍ</Text>
                    </View>
                    <View style={styles.tableColHeader}>
                        <Text style={styles.tableCell}>ລາຄາລວມ</Text>
                    </View>
                    <View style={styles.tableColHeader}>
                        <Text style={styles.tableCell}>ວັນທີສັ່ງຊື້</Text>
                    </View>
                    <View style={styles.tableColHeader}>
                        <Text style={styles.tableCell}>ສະຖານະ</Text>
                    </View>
                </View>

                {/* ข้อมูลในตาราง */}
                {purchaseOrders.map((order) => (
                    <View style={styles.tableRow} key={order.id}>
                        <View style={styles.tableCol}>
                            <Text style={styles.tableCell}>{order.orderNumber}</Text>
                        </View>
                        <View style={styles.tableCol}>
                            <Text style={styles.tableCell}>{order.supplierName}</Text>
                        </View>
                        <View style={styles.tableCol}>
                            <Text style={styles.tableCell}>{order.items}</Text>
                        </View>
                        <View style={styles.tableCol}>
                            <Text style={styles.tableCell}>{order.quantity}</Text>
                        </View>
                        <View style={styles.tableCol}>
                            <Text style={styles.tableCell}>{order.unitPrice}</Text>
                        </View>
                        <View style={styles.tableCol}>
                            <Text style={styles.tableCell}>{order.totalAmount}</Text>
                        </View>
                        <View style={styles.tableCol}>
                            <Text style={styles.tableCell}>{order.orderDate}</Text>
                        </View>
                        <View style={styles.tableCol}>
                            <Text style={styles.tableCell}>{order.status}</Text>
                        </View>
                    </View>
                ))}
            </View>
        </Page>
    </Document>
);

const ReportBuy = () => {
    const reportRef = useRef(null);

    // ຂໍ້ມູນໃບສັ່ງຊື້ເຄື່ອງດື່ມ
    const purchaseOrders = [
        {
            id: 1,
            orderNumber: 'PO-2024001',
            supplierName: 'ບໍລິສັດ ລາວເບຍ ຈຳກັດ',
            items: 'ເບຍລາວ 24 ແກ້ວ',
            quantity: '100 ແພັກ',
            unitPrice: '120,000 ກີບ',
            totalAmount: '1,200,000 ກີບ',
            status: 'ຮັບສິນຄ້າແລ້ວ',
            orderDate: '2024-03-15'
        },
        {
            id: 2,
            orderNumber: 'PO-2024002',
            supplierName: 'ຕົວແທນ Coca-Cola',
            items: 'Coca-Cola 330ml',
            quantity: '15 ແພັກ',
            unitPrice: '85,000 ກີບ',
            totalAmount: '1,275,000 ກີບ',
            status: 'ລໍຖ້າຮັບສິນຄ້າ',
            orderDate: '2024-03-16'
        },
        {
            id: 3,
            orderNumber: 'PO-2024003',
            supplierName: 'ຮ້ານ ນ້ຳດື່ມສິນທອງ',
            items: 'ນ້ຳດື່ມ 500ml',
            quantity: '20 ແພັກ',
            unitPrice: '25,000 ກີບ',
            totalAmount: '500,000 ກີບ',
            status: 'ຮັບສິນຄ້າແລ້ວ',
            orderDate: '2024-03-17'
        }
    ];

    const columns = [
        {
            title: 'ເລກທີໃບສັ່ງຊື້',
            dataIndex: 'orderNumber',
            key: 'orderNumber'
        },
        {
            title: 'ຊື່ຜູ້ສະໜອງ',
            dataIndex: 'supplierName',
            key: 'supplierName'
        },
        {
            title: 'ລາຍການສິນຄ້າ',
            dataIndex: 'items',
            key: 'items'
        },
        {
            title: 'ຈຳນວນ',
            dataIndex: 'quantity',
            key: 'quantity'
        },
        {
            title: 'ລາຄາຕໍ່ຫົວໜ່ວຍ',
            dataIndex: 'unitPrice',
            key: 'unitPrice'
        },
        {
            title: 'ລາຄາລວມ',
            dataIndex: 'totalAmount',
            key: 'totalAmount'
        },
        {
            title: 'ວັນທີສັ່ງຊື້',
            dataIndex: 'orderDate',
            key: 'orderDate'
        },
        {
            title: 'ສະຖານະ',
            dataIndex: 'status',
            key: 'status'
        },
        {
            title: 'ຈັດການ',
            key: 'action',
            render: (_, record) => (
                <div className="flex gap-2">
                    <button
                        onClick={() => handleEdit(record)}
                        className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
                    >
                        ແກ້ໄຂ
                    </button>
                    <button
                        onClick={() => handleDelete(record)}
                        className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                    >
                        ລົບ
                    </button>
                </div>
            )
        }
    ];

    const handleEdit = (record) => {
        // ເພີ່ມ logic ສຳລັບການແກ້ໄຂຂໍ້ມູນ
        console.log('Edit:', record);
    };

    const handleDelete = (record) => {
        // ເພີ່ມ logic ສຳລັບການລົບຂໍ້ມູນ
        console.log('Delete:', record);
    };

    const onChange = (date, dateString) => {
        console.log(date, dateString);
    };

    return (
        <div>
            {/* <h1 className='text-[20px] font-semibold mb-2'>ລາຍງານໃບສັ່ງຊື້</h1> */}
            <div className=' bg-white rounded-md p-4'>
                <div className='flex items-center justify-between mb-4'>
                    <div className='flex items-center gap-x-2'>
                        <p>ເລືອກວັນທີ : </p>
                        <Space direction="vertical">
                            <DatePicker
                                format={{
                                    format: 'YYYY-MM-DD',
                                    type: 'mask',
                                }}
                                onChange={onChange}
                            />
                        </Space>
                    </div>
                    <PDFDownloadLink
                        document={<PurchaseOrderPDF purchaseOrders={purchaseOrders} />}
                        fileName="ລາຍງານການສັ່ງຊື້.pdf"
                        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                    >
                        {({ blob, url, loading, error }) =>
                            loading ? 'Loading document...' : 'Export PDF'
                        }
                    </PDFDownloadLink>
                </div>

                {/* ສ່ວນທີ່ຈະ export ເປັນ PDF */}
                <div ref={reportRef} className="p-4">
                    <h2 className="text-xl font-bold text-center mb-4">ລາຍງານການສັ່ງຊື້ເຄື່ອງດື່ມ</h2>
                    <table className="min-w-full bg-white border border-gray-300">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="border p-2">ເລກທີໃບສັ່ງຊື້</th>
                                <th className="border p-2">ຊື່ຜູ້ສະໜອງ</th>
                                <th className="border p-2">ລາຍການສິນຄ້າ</th>
                                <th className="border p-2">ຈຳນວນ</th>
                                <th className="border p-2">ລາຄາຕໍ່ຫົວໜ່ວຍ</th>
                                <th className="border p-2">ລາຄາລວມ</th>
                                <th className="border p-2">ວັນທີສັ່ງຊື້</th>
                                <th className="border p-2">ສະຖານະ</th>
                            </tr>
                        </thead>
                        <tbody>
                            {purchaseOrders.map((order) => (
                                <tr key={order.id}>
                                    <td className="border p-2">{order.orderNumber}</td>
                                    <td className="border p-2">{order.supplierName}</td>
                                    <td className="border p-2">{order.items}</td>
                                    <td className="border p-2">{order.quantity}</td>
                                    <td className="border p-2">{order.unitPrice}</td>
                                    <td className="border p-2">{order.totalAmount}</td>
                                    <td className="border p-2">{order.orderDate}</td>
                                    <td className="border p-2">{order.status}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* ຕາຕະລາງສຳລັບການສະແດງຜົນໃນໜ້າເວັບ */}
                <Table
                    columns={columns}
                    dataSource={purchaseOrders}
                    rowKey="id"
                />
            </div>
        </div>
    )
}

export default ReportBuy