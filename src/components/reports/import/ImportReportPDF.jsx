import React from 'react';
import { Page, Text, View, Document, StyleSheet, Font } from '@react-pdf/renderer';
import NotoSansLaoFont from '../../../fonts/NOTOSANSLAO-MEDIUM.TTF';

// ລົງທະບຽນຟອນລາວ
Font.register({
    family: 'NotoSansLao',
    src: NotoSansLaoFont
});

// ສ້າງ styles ສຳລັບ PDF
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
        flexDirection: 'row'
    },
    tableColHeader: {
        // width: '14.68%', // เดิม
        width: 'auto', // ปรับเป็น auto เพื่อให้แต่ละคอลัมน์กำหนดความกว้างเอง
        borderStyle: 'solid',
        borderWidth: 1,
        borderColor: '#bfbfbf',
        backgroundColor: '#f0f0f0',
        padding: 5,
    },
    tableCol: {
        // width: '14.68%', // เดิม
        width: 'auto', // ปรับเป็น auto เพื่อให้แต่ละคอลัมน์กำหนดความกว้างเอง
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

const ImportReportPDF = ({ importData }) => (
    <Document>
        <Page size="A4" style={styles.page}>
            <Text style={styles.title}>ລາຍງານສິນຄ້ານຳເຂົ້າ</Text>
            <View style={styles.table}>
                <View style={styles.tableRow}>
                    <View style={{ ...styles.tableColHeader, width: '8%' }}> {/* ลำดับ */}
                        <Text style={styles.tableCell}>ລຳດັບ</Text>
                    </View>
                    <View style={{ ...styles.tableColHeader, width: '18%' }}> {/* วันที่/เวลา */}
                        <Text style={styles.tableCell}>ວັນທີ/ເວລາ</Text>
                    </View>
                    <View style={{ ...styles.tableColHeader, width: '20%' }}> {/* ชื่อผู้จัดหา */}
                        <Text style={styles.tableCell}>ຊື່ຜູ້ສະໜອງ</Text>
                    </View>
                    <View style={{ ...styles.tableColHeader, width: '15%' }}> {/* เบอร์โทรผู้จัดหา */}
                        <Text style={styles.tableCell}>ເບີໂທຜູ້ສະໜອງ</Text>
                    </View>
                    <View style={{ ...styles.tableColHeader, width: '12%' }}> {/* จำนวนรวม */}
                        <Text style={styles.tableCell}>ຈຳນວນລວມ</Text>
                    </View>
                    <View style={{ ...styles.tableColHeader, width: '15%' }}> {/* ราคารวม */}
                        <Text style={styles.tableCell}>ລາຄາລວມ</Text>
                    </View>
                    <View style={{ ...styles.tableColHeader, width: '12%' }}> {/* สถานะ */}
                        <Text style={styles.tableCell}>ສະຖານະ</Text>
                    </View>
                </View>

                {importData.map((item) => (
                    <View style={styles.tableRow} key={item.key}>
                        <View style={{ ...styles.tableCol, width: '8%' }}>
                            <Text style={styles.tableCell}>{item.order}</Text>
                        </View>
                        <View style={{ ...styles.tableCol, width: '18%' }}>
                            <Text style={styles.tableCell}>{item.date} {item.time}</Text>
                        </View>
                        <View style={{ ...styles.tableCol, width: '20%' }}>
                            <Text style={styles.tableCell}>{item.supplier}</Text>
                        </View>
                        <View style={{ ...styles.tableCol, width: '15%' }}>
                            <Text style={styles.tableCell}>{item.phoneNumber}</Text>
                        </View>
                        <View style={{ ...styles.tableCol, width: '12%' }}>
                            <Text style={styles.tableCell}>{item.importQuantity}</Text>
                        </View>
                        <View style={{ ...styles.tableCol, width: '15%' }}>
                            <Text style={styles.tableCell}>{item.total}</Text>
                        </View>
                        <View style={{ ...styles.tableCol, width: '12%' }}>
                            <Text style={styles.tableCell}>{item.status}</Text>
                        </View>
                    </View>
                ))}
            </View>
        </Page>
    </Document>
);

export default ImportReportPDF;