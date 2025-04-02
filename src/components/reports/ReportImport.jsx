import React, { useRef } from 'react'
import { DatePicker, Space } from 'antd';
import { Page, Text, View, Document, StyleSheet, PDFDownloadLink, Font } from '@react-pdf/renderer';
import NotoSansLaoFont from '../../fonts/NOTOSANSLAO-MEDIUM.TTF';
import ImportTable from './import/ImportTable';
import ImportReportPDF from './import/ImportReportPDF';

const ReportImport = () => {
    const reportRef = useRef(null);

    // ຂໍ້ມູນສິນຄ້ານຳເຂົ້າ (ຕົວຢ່າງ)
    const importData = [
        {
            id: 1,
            importNumber: 'IMP-2024001',
            productName: 'ເບຍລາວ',
            category: 'ເຄື່ອງດື່ມແອວກໍຮໍ',
            quantity: '200 ແພັກ',
            importPrice: '100,000 ກີບ',
            totalAmount: '20,000,000 ກີບ',
            importDate: '2024-03-15',
            status: 'ນຳເຂົ້າແລ້ວ'
        },
        {
            id: 2,
            importNumber: 'IMP-2024002',
            productName: 'ນ້ຳດື່ມ',
            category: 'ເຄື່ອງດື່ມທົ່ວໄປ',
            quantity: '300 ແພັກ',
            importPrice: '25,000 ກີບ',
            totalAmount: '7,500,000 ກີບ',
            importDate: '2024-03-16',
            status: 'ນຳເຂົ້າແລ້ວ'
        },
        {
            id: 3,
            importNumber: 'IMP-2024003',
            productName: 'Coca-Cola',
            category: 'ເຄື່ອງດື່ມທົ່ວໄປ',
            quantity: '150 ແພັກ',
            importPrice: '85,000 ກີບ',
            totalAmount: '12,750,000 ກີບ',
            importDate: '2024-03-17',
            status: 'ລໍຖ້າຮັບສິນຄ້າ'
        }
    ];

    const handleEdit = (record) => {
        console.log('Edit:', record);
    };

    const handleDelete = (record) => {
        console.log('Delete:', record);
    };

    const onChange = (date, dateString) => {
        console.log(date, dateString);
    };

    return (
        <div>
            <div className='bg-white rounded-md p-4'>
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
                        document={<ImportReportPDF importData={importData} />}
                        fileName="ລາຍງານສິນຄ້ານຳເຂົ້າ.pdf"
                        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                    >
                        {({ blob, url, loading, error }) =>
                            loading ? 'Loading document...' : 'Export PDF'
                        }
                    </PDFDownloadLink>
                </div>

                <ImportTable
                    importData={importData}
                    handleEdit={handleEdit}
                    handleDelete={handleDelete}
                />
            </div>
        </div>
    )
}

export default ReportImport