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

const ImportReportPDF = ({ importData }) => (
    <Document>
        <Page size="A4" orientation="landscape" style={styles.page}>
            <Text style={styles.title}>ລາຍງານສິນຄ້ານຳເຂົ້າ</Text>
            <View style={styles.table}>
                <View style={styles.tableRow}>
                    <View style={styles.tableColHeader}>
                        <Text style={styles.tableCell}>ເລກທີນຳເຂົ້າ</Text>
                    </View>
                    <View style={styles.tableColHeader}>
                        <Text style={styles.tableCell}>ຊື່ສິນຄ້າ</Text>
                    </View>
                    <View style={styles.tableColHeader}>
                        <Text style={styles.tableCell}>ປະເພດສິນຄ້າ</Text>
                    </View>
                    <View style={styles.tableColHeader}>
                        <Text style={styles.tableCell}>ຈຳນວນ</Text>
                    </View>
                    <View style={styles.tableColHeader}>
                        <Text style={styles.tableCell}>ລາຄານຳເຂົ້າ</Text>
                    </View>
                    <View style={styles.tableColHeader}>
                        <Text style={styles.tableCell}>ລາຄາລວມ</Text>
                    </View>
                    <View style={styles.tableColHeader}>
                        <Text style={styles.tableCell}>ວັນທີນຳເຂົ້າ</Text>
                    </View>
                    <View style={styles.tableColHeader}>
                        <Text style={styles.tableCell}>ສະຖານະ</Text>
                    </View>
                </View>

                {importData.map((item) => (
                    <View style={styles.tableRow} key={item.id}>
                        <View style={styles.tableCol}>
                            <Text style={styles.tableCell}>{item.importNumber}</Text>
                        </View>
                        <View style={styles.tableCol}>
                            <Text style={styles.tableCell}>{item.productName}</Text>
                        </View>
                        <View style={styles.tableCol}>
                            <Text style={styles.tableCell}>{item.category}</Text>
                        </View>
                        <View style={styles.tableCol}>
                            <Text style={styles.tableCell}>{item.quantity}</Text>
                        </View>
                        <View style={styles.tableCol}>
                            <Text style={styles.tableCell}>{item.importPrice}</Text>
                        </View>
                        <View style={styles.tableCol}>
                            <Text style={styles.tableCell}>{item.totalAmount}</Text>
                        </View>
                        <View style={styles.tableCol}>
                            <Text style={styles.tableCell}>{item.importDate}</Text>
                        </View>
                        <View style={styles.tableCol}>
                            <Text style={styles.tableCell}>{item.status}</Text>
                        </View>
                    </View>
                ))}
            </View>
        </Page>
    </Document>
);

export default ImportReportPDF;