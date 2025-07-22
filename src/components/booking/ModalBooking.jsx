import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, DatePicker, Select, message, Spin, Radio } from 'antd';
import axios from 'axios';
import ApiPath from '../../api/apiPath'; // ปรับ path ตามจริง
import moment from 'moment';

const { Option } = Select;

const RESERVATION_DURATION_MINUTES = 120; // กำหนดระยะเวลาจอง เช่น 2 ชั่วโมง

const ModalBooking = ({ isModalOpen, handleCloseModal, form, onBookingCreated }) => {
    const [customers, setCustomers] = useState([]);
    const [tables, setTables] = useState([]);
    const [allReservations, setAllReservations] = useState([]); // เก็บข้อมูลจองทั้งหมด
    const [loadingCustomers, setLoadingCustomers] = useState(false);
    const [loadingTables, setLoadingTables] = useState(false);
    const [loadingReservations, setLoadingReservations] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [isNewCustomer, setIsNewCustomer] = useState(false);
    const [reservationTimeKey, setReservationTimeKey] = useState(Date.now()); // State to force re-render of table select

    // โหลดข้อมูลลูกค้า โต๊ะ และการจองทั้งหมดเมื่อเปิด modal
    useEffect(() => {
        if (isModalOpen) {
            form.resetFields();
            setIsNewCustomer(false);
            form.setFieldsValue({ customerToggle: false });
            setReservationTimeKey(Date.now()); // Reset key when modal opens

            fetchCustomers();
            fetchTables();
            fetchAllReservations();
        } else {
            form.resetFields();
        }
    }, [isModalOpen]);

    // ตั้งค่าเบอร์โทรเริ่มต้นเมื่อเลือกเพิ่มลูกค้าใหม่
    useEffect(() => {
        if (isNewCustomer) {
            form.setFieldsValue({ phone: '020' });
        } else {
            form.setFieldsValue({ phone: undefined }); // Clear phone if switching back to existing customer
        }
    }, [isNewCustomer, form]);

    const fetchCustomers = async () => {
        setLoadingCustomers(true);
        try {
            const response = await axios.get(ApiPath.getCustomers);
            setCustomers(response.data);
        } catch (error) {
            console.error("Error fetching customers:", error);
            message.error('ບໍ່ສາມາດໂຫຼດຂໍ້ມູນລູກຄ້າໄດ້');
        } finally {
            setLoadingCustomers(false);
        }
    };

    const fetchTables = async () => {
        setLoadingTables(true);
        try {
            const response = await axios.get(ApiPath.getTable);
            setTables(response.data);
        } catch (error) {
            console.error("Error fetching tables:", error);
            message.error('ບໍ່ສາມາດໂຫຼດຂໍ້ມູນໂຕະໄດ້');
        } finally {
            setLoadingTables(false);
        }
    };

    const fetchAllReservations = async () => {
        setLoadingReservations(true);
        try {
            const res = await axios.get(ApiPath.getReservations);
            setAllReservations(res.data);
        } catch (error) {
            console.error("Error fetching reservations:", error);
            message.error('ບໍ່ສາມາດໂຫຼດການຈອງໄດ້');
        } finally {
            setLoadingReservations(false);
        }
    };

    const handleCustomerToggleChange = (e) => {
        const newIsNewCustomer = e.target.value;
        setIsNewCustomer(newIsNewCustomer);
        form.setFieldsValue({
            customerId: undefined,
            fname: undefined,
            lname: undefined,
            phone: undefined
        });
        if (!newIsNewCustomer && customers.length === 0) {
            fetchCustomers();
        }
    };

    // ฟังก์ชันเช็คโต๊ะว่าว่างในเวลาที่เลือกไหม
    const isTableAvailable = (tableId, selectedDateTime) => {
        // const RESERVATION_DURATION_MINUTES = 120; // กำหนดระยะเวลาจอง เช่น 2 ชั่วโมง // Moved to global scope

        if (!moment.isMoment(selectedDateTime)) {
            return true; // ถ้า selectedDateTime ไม่ใช่ object moment ที่ถูกต้อง ให้ถือว่าโต๊ะว่าง
        }

        // กรองจองโต๊ะนี้ทั้งหมด
        const reservationsForTable = allReservations.filter(r => r.tableId === tableId && r.status !== 'cancelled');

        for (const r of reservationsForTable) {
            const reservedStart = moment(r.reservationTime);
            const reservedEnd = reservedStart.clone().add(RESERVATION_DURATION_MINUTES, 'minutes');

            if (selectedDateTime.isBetween(reservedStart, reservedEnd, null, '[)')) {
                return false; // โต๊ะไม่ว่างเพราะเวลาซ้อนทับ
            }
        }
        return true; // โต๊ะว่าง
    };

    const handleSubmit = async (values) => {
        setSubmitting(true);

        try {
            let customerDataToSend = {}; // This will hold the customer data for the reservation payload

            if (isNewCustomer) {
                // For new customer, use provided form values
                customerDataToSend = {
                    fname: values.fname,
                    lname: values.lname,
                    phone: values.phone,
                };
            } else {
                // For existing customer, find their data from the 'customers' state
                const selectedCustomer = customers.find(cust => cust.id === values.customerId);
                if (!selectedCustomer) {
                    message.error('ບໍ່ພົບຂໍ້ມູນລູກຄ້າທີ່ເລືອກ');
                    setSubmitting(false);
                    return;
                }
                customerDataToSend = {
                    fname: selectedCustomer.fname,
                    lname: selectedCustomer.lname,
                    phone: selectedCustomer.phone,
                };
            }

            // Removed separate customer creation call as backend handles it

            // เช็คโต๊ะว่างก่อนส่ง (Frontend validation for better UX)
            if (!isTableAvailable(values.tableId, values.reservationTime)) {
                message.error('ໂຕະນີ້ຖືກຈອງແລ້ວໃນເວລານີ້, ກະລຸນາເລືອກໂຕະອື່ນ ຫຼື ເລືອກເວລາອື່ນ');
                setSubmitting(false);
                return;
            }

            const reservationPayload = {
                customerData: customerDataToSend, // Send customerData as an object
                tableId: values.tableId,
                reservationTime: values.reservationTime.toISOString(),
            };

            const reservationResponse = await axios.post(ApiPath.createReservation, reservationPayload);

            message.success('ສ້າງການຈອງສຳເລັດ!');
            onBookingCreated();
            handleCloseModal();

        } catch (error) {
            console.error("Error creating reservation:", error.response?.data || error.message);
            const errorMessage = error.response?.data?.message || 'ເກີດຂໍ້ຜິດພາດໃນການສ້າງການຈອງ';
            // Use backend's specific error message for 409 conflicts
            if (error.response && error.response.status === 409) {
                message.error(error.response.data.message);
            } else {
                message.error(errorMessage);
            }
        } finally {
            setSubmitting(false);
        }
    };

    // กรองโต๊ะที่ว่างตามเวลาที่เลือก (อัปเดต Select โต๊ะ)
    const availableTables = tables.filter(table => {
        const selectedDateTime = form.getFieldValue('reservationTime');
        if (!selectedDateTime) return true; // ถ้ายังไม่เลือกเวลา ให้แสดงทุกโต๊ะ
        return isTableAvailable(table.id, selectedDateTime);
    });

    return (
        <Modal
            title="ເພີ່ມລາຍການການຈອງ"
            open={isModalOpen}
            onCancel={handleCloseModal}
            onOk={() => form.submit()}
            okText="ບັນທຶກ"
            cancelText="ຍົກເລີກ"
            confirmLoading={submitting}
            destroyOnClose
        >
            <Spin spinning={loadingCustomers || loadingTables || loadingReservations || submitting}>
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleSubmit}
                    name="bookingForm"
                    initialValues={{
                        customerToggle: false,
                        phone: '020' // Set initial value for phone
                    }}
                >
                    <Form.Item label="ເລືອກ ຫຼື ເພີ່ມລູກຄ້າ" name="customerToggle">
                        <Radio.Group onChange={handleCustomerToggleChange} value={isNewCustomer}>
                            <Radio value={false}>ເລືອກລູກຄ້າ</Radio>
                            <Radio value={true}>ເພີ່ມລູກຄ້າໃໝ່</Radio>
                        </Radio.Group>
                    </Form.Item>

                    {!isNewCustomer ? (
                        <Form.Item
                            name="customerId"
                            label="ເລືອກລູກຄ້າ"
                            rules={[{ required: !isNewCustomer, message: 'ກະລຸນາເລືອກລູກຄ້າ' }]}
                        >
                            <Select
                                placeholder="ເລືອກລູກຄ້າ"
                                loading={loadingCustomers}
                                showSearch
                                filterOption={(input, option) =>
                                    (option?.children ?? '').toLowerCase().includes(input.toLowerCase())
                                }
                            >
                                {customers.map(customer => (
                                    <Option key={customer.id} value={customer.id}>
                                        {`${customer.fname} ${customer.lname} (${customer.phone})`}
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>
                    ) : (
                        <>
                            <Form.Item
                                name="fname"
                                label="ຊື່ແທ້"
                                rules={[{ required: isNewCustomer, message: 'ກະລຸນາປ້ອນຊື່ແທ້' }]}
                            >
                                <Input />
                            </Form.Item>
                            <Form.Item
                                name="lname"
                                label="ນາມສະກຸນ"
                                rules={[{ required: isNewCustomer, message: 'ກະລຸນາປ້ອນນາມສະກຸນ' }]}
                            >
                                <Input />
                            </Form.Item>
                            <Form.Item
                                name="phone"
                                label="ເບີໂທ"
                                rules={[
                                    { required: isNewCustomer, message: 'ກະລຸນາປ້ອນເບີໂທ' },
                                    { pattern: /^[0-9]+$/, message: 'ເບີໂທຕ້ອງເປັນຕົວເລກເທົ່ານັ້ນ!' },
                                    { min: 11, max: 11, message: 'ເບີໂທຕ້ອງມີ 11 ຫຼັກ!' }
                                ]}
                            >
                                <Input />
                            </Form.Item>
                        </>
                    )}

                    <Form.Item
                        name="reservationTime"
                        label="ວັນທີ ແລະ ເວລາຈອງ"
                        rules={[{ required: true, message: 'ກະລຸນາເລືອກວັນທີ ແລະ ເວລາຈອງ' }]}
                    >
                        <DatePicker
                            showTime={{ format: 'HH:mm' }}
                            format="DD/MM/YYYY HH:mm"
                            style={{ width: '100%' }}
                            disabledDate={(current) => {
                                return current && current < moment().startOf('day');
                            }}
                            disabledTime={(current) => {
                                if (!current) return {};
                                if (current.isSame(moment(), 'day')) {
                                    const hours = [];
                                    for (let i = 0; i < moment().hour(); i++) {
                                        hours.push(i);
                                    }
                                    const minutes = [];
                                    if (current.hour() === moment().hour()) {
                                        for (let i = 0; i < moment().minute(); i++) {
                                            minutes.push(i);
                                        }
                                    }
                                    return {
                                        disabledHours: () => hours,
                                        disabledMinutes: () => minutes,
                                    };
                                }
                                return {};
                            }}
                            onChange={() => {
                                setReservationTimeKey(Date.now()); // Update key to force re-render of Select
                                form.setFieldsValue({ tableId: undefined }); // Clear selected table when time changes
                            }}
                        />
                    </Form.Item>

                    <Form.Item
                        name="tableId"
                        label="ເລືອກໂຕະ (ທີ່ວ່າງ)"
                        rules={[{ required: true, message: 'ກະລຸນາເລືອກໂຕະ' }]}
                    >
                        <Select key={reservationTimeKey} placeholder="ເລືອກໂຕະ" loading={loadingTables}>
                            {availableTables.map(table => (
                                <Option key={table.id} value={table.id}>
                                    {`ໂຕະ ${table.table_number} (ບ່ອນນັ່ງ: ${table.seat})`}
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>


                </Form>
            </Spin>
        </Modal>
    );
};

export default ModalBooking;
