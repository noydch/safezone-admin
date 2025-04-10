import React, { useRef, useState, useEffect } from 'react'
import { DatePicker, Space, Tag, Button, Table } from 'antd';
import { Page, Text, View, Document, StyleSheet, PDFDownloadLink, Font } from '@react-pdf/renderer';
import NotoSansLaoFont from '../../fonts/NOTOSANSLAO-MEDIUM.TTF';
import ImportTable from './import/ImportTable';
import ImportReportPDF from './import/ImportReportPDF';
import { RightOutlined } from '@ant-design/icons';
import axios from 'axios';
import ApiPath from '../../api/apiPath';

// Destructure RangePicker from DatePicker
const { RangePicker } = DatePicker;

const ReportImport = () => {
    const reportRef = useRef(null);
    const [importData, setImportData] = useState([]);
    const [loading, setLoading] = useState(false);
    // Change selectedDate to an array to hold start and end dates
    const [selectedDateRange, setSelectedDateRange] = useState([null, null]);

    // Fetch import data
    const fetchImportData = async () => {
        try {
            setLoading(true);
            const response = await axios.get(ApiPath.getImport);
            const formattedData = response.data.map((item, index) => ({
                key: item.id,
                order: index + 1,
                importDateRaw: new Date(item.importDate),
                date: new Date(item.importDate).toLocaleDateString('en-GB'),
                time: new Date(item.importDate).toLocaleTimeString('en-GB', { hour12: false }),
                supplier: item.purchaseOrder?.supplier?.name || '-',
                phoneNumber: item.purchaseOrder?.supplier?.phone || '-',
                importQuantity: item.purchaseOrder?.details?.reduce((sum, detail) => sum + detail.quantity, 0) || 0,
                total: `${item.totalPrice.toLocaleString()} ກີບ`,
                status: item.status === 'pending' ? 'ລໍຖ້າຢືນຢັນ' :
                    item.status === 'approved' ? 'ອະນຸມັດແລ້ວ' :
                        item.status === 'rejected' ? 'ຖືກປະຕິເສດ' : item.status
            }));
            setImportData(formattedData);
        } catch (error) {
            console.error('Error fetching import data:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchImportData();
    }, []);

    const handleEdit = (record) => {
        console.log('Edit:', record);
    };

    const handleDelete = (record) => {
        console.log('Delete:', record);
    };

    // Update onChange to handle date range
    const onChange = (dates, dateStrings) => {
        console.log('From: ', dates?.[0], ', to: ', dates?.[1]);
        console.log('From: ', dateStrings?.[0], ', to: ', dateStrings?.[1]);
        // Store the date strings [startDate, endDate] or [null, null] if cleared
        setSelectedDateRange(dateStrings || [null, null]);
    };

    // Filter data based on the selected date range using local dates
    const filteredData = selectedDateRange[0] && selectedDateRange[1]
        ? importData.filter(item => {
            // Get the local date parts from importDateRaw
            const year = item.importDateRaw.getFullYear();
            // Month is 0-indexed, so add 1 and pad with '0' if needed
            const month = String(item.importDateRaw.getMonth() + 1).padStart(2, '0');
            // Pad day with '0' if needed
            const day = String(item.importDateRaw.getDate()).padStart(2, '0');
            const itemLocalDate = `${year}-${month}-${day}`; // Format as YYYY-MM-DD

            // Check if itemLocalDate is within the selected range (inclusive)
            // selectedDateRange[0] and selectedDateRange[1] are already YYYY-MM-DD strings from the picker
            return itemLocalDate >= selectedDateRange[0] && itemLocalDate <= selectedDateRange[1];
        })
        : importData; // If no range is selected, show all data

    // Define columns for the table
    const columns = [
        {
            title: 'ລຳດັບ',
            dataIndex: 'order',
            key: 'order',
            width: 80,
        },
        {
            title: 'ຊື່ຜູ້ສະໜອງ',
            dataIndex: 'supplier',
            key: 'supplier',
            width: 150,
        },
        {
            title: 'ເບີໂທຜູ້ສະໜອງ',
            dataIndex: 'phoneNumber',
            key: 'phoneNumber',
            width: 120,
        },
        {
            title: 'ຈຳນວນສິນຄ້ານຳເຂົ້າ',
            dataIndex: 'importQuantity',
            key: 'importQuantity',
            width: 100,
            render: (text) => (
                <div className="bg-yellow-100 text-center py-2 px-4 rounded">{text}</div>
            ),
        },
        {
            title: 'ລາຄາລວມ',
            dataIndex: 'total',
            key: 'total',
            width: 120,
        },
        {
            title: 'ວັນທີ/ເວລານຳເຂົ້າ',
            dataIndex: 'date',
            key: 'date',
            render: (text, record) => (
                <div className=' flex items-center gap-x-4'>
                    <div>{record.date}</div>
                    <div>{record.time}</div>
                </div>
            ),
            width: 160,
            sorter: (a, b) => a.importDateRaw - b.importDateRaw,
        },
        {
            title: 'ສະຖານະ',
            dataIndex: 'status',
            key: 'status',
            width: 120,
            render: (status) => {
                let color = 'blue';
                if (status === 'ອະນຸມັດແລ້ວ') color = 'green';
                if (status === 'ລໍຖ້າຢືນຢັນ') color = 'gold';
                return (
                    <Tag color={color} className="px-4 py-1">
                        {status}
                    </Tag>
                );
            },
        },
        // {
        //     title: 'ຈັດການ',
        //     key: 'action',
        //     render: (_, record) => (
        //         <Space size="small">
        //             <Button
        //                 type="link"
        //                 className="text-amber-500 flex items-center"
        //                 onClick={() => handleEdit(record)}
        //             >
        //                 ລາຍລະອຽດ <RightOutlined />
        //             </Button>
        //         </Space>
        //     ),
        //     width: 150,
        // },
    ];

    return (
        <div>
            <div className='bg-white rounded-md p-4'>
                <div className='flex items-center justify-between mb-4'>
                    <div className='flex items-center gap-x-2'>
                        <p>ເລືອກຊ່ວງວັນທີ : </p>
                        <Space direction="vertical">
                            <RangePicker
                                format={{
                                    format: 'YYYY-MM-DD',
                                    type: 'mask',
                                }}
                                onChange={onChange}
                                allowClear={true}
                            />
                        </Space>
                    </div>
                    <PDFDownloadLink
                        document={<ImportReportPDF importData={filteredData} />}
                        fileName={`ລາຍງານສິນຄ້ານຳເຂົ້າ${selectedDateRange[0] && selectedDateRange[1] ? `_${selectedDateRange[0]}_to_${selectedDateRange[1]}` : ''}.pdf`}
                        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                    >
                        {({ blob, url, loading, error }) =>
                            loading ? 'Loading document...' : 'Export PDF'
                        }
                    </PDFDownloadLink>
                </div>

                <Table
                    dataSource={filteredData}
                    columns={columns}
                    pagination={{ pageSize: 10 }}
                    loading={loading}
                    bordered
                />
            </div>
        </div>
    )
}

export default ReportImport