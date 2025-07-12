import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, DatePicker, Select, message, Spin, Radio } from 'antd';
import axios from 'axios';
import ApiPath from '../../api/apiPath'; // Ensure this path is correct
import moment from 'moment';

const { Option } = Select;

const ModalBooking = ({ isModalOpen, handleCloseModal, form, onBookingCreated }) => {
    const [customers, setCustomers] = useState([]);
    const [tables, setTables] = useState([]);
    const [loadingCustomers, setLoadingCustomers] = useState(false);
    const [loadingTables, setLoadingTables] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [isNewCustomer, setIsNewCustomer] = useState(false);

    useEffect(() => {
        if (isModalOpen) {
            // Reset form fields when modal opens
            form.resetFields();
            // Set default for Radio Group
            setIsNewCustomer(false); // Default to selecting existing customer
            form.setFieldsValue({ customerToggle: false }); // Ensure radio button reflects initial state

            // Fetch data only if not adding a new customer initially or if no customers exist
            if (!isNewCustomer || customers.length === 0) {
                fetchCustomers();
            }
            fetchTables();
        } else {
            // Reset form fields when modal closes
            form.resetFields();
        }
    }, [isModalOpen]); // Depend on isModalOpen

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
            // Filter tables that are 'ວ່າງ' (available)
            setTables(response.data.filter(table => table.status === 'ວ່າງ'));
        } catch (error) {
            console.error("Error fetching tables:", error);
            message.error('ບໍ່ສາມາດໂຫຼດຂໍ້ມູນໂຕະໄດ້');
        } finally {
            setLoadingTables(false);
        }
    };

    const handleCustomerToggleChange = (e) => {
        const newIsNewCustomer = e.target.value;
        setIsNewCustomer(newIsNewCustomer);
        // Reset customer-related fields based on toggle
        form.setFieldsValue({
            customerId: undefined,
            fname: undefined,
            lname: undefined,
            phone: undefined
        });
        // If switching to "Select Customer" and customers list is empty, fetch them
        if (!newIsNewCustomer && customers.length === 0) {
            fetchCustomers();
        }
    };

    const handleSubmit = async (values) => {
        setSubmitting(true);
        let customerIdToUse = values.customerId;

        try {
            if (isNewCustomer) {
                const newCustomerPayload = {
                    fname: values.fname,
                    lname: values.lname,
                    phone: values.phone,
                };
                try {
                    console.log("Creating new customer:", newCustomerPayload);
                    const customerResponse = await axios.post(ApiPath.createCustomer, newCustomerPayload);
                    customerIdToUse = customerResponse.data.id;
                    console.log("New customer created:", customerResponse.data);
                } catch (customerError) {
                    console.error("Error creating customer:", customerError.response?.data || customerError.message);
                    const customerErrorMessage = customerError.response?.data?.message || 'ເກີດຂໍ້ຜິດພາດໃນການສ້າງລູກຄ້າ';
                    if (customerError.response?.status === 409) {
                        message.error('ເບີໂທນີ້ມີລູກຄ້າຢູ່ແລ້ວ.');
                    } else {
                        message.error(customerErrorMessage);
                    }
                    setSubmitting(false);
                    return; // Stop execution if customer creation fails
                }
            }

            if (!customerIdToUse) {
                message.error('ກະລຸນາເລືອກ ຫຼື ເພີ່ມລູກຄ້າກ່ອນ.');
                setSubmitting(false);
                return;
            }

            // Ensure reservationTime is a Moment object, then convert to ISO string
            const reservationPayload = {
                customerId: customerIdToUse,
                tableId: values.tableId,
                // Ensure values.reservationTime is a moment object and convert to ISO string (UTC)
                reservationTime: values.reservationTime.toISOString(),
            };

            console.log("Creating reservation with payload:", reservationPayload);
            const reservationResponse = await axios.post(ApiPath.createReservation, reservationPayload);

            console.log("Reservation created:", reservationResponse.data);
            message.success('ສ້າງການຈອງສຳເລັດ!');
            onBookingCreated(); // Callback to refresh parent component data
            handleCloseModal(); // Close the modal

        } catch (error) {
            console.error("Error creating reservation:", error.response?.data || error.message);
            const errorMessage = error.response?.data?.message || 'ເກີດຂໍ້ຜິດພາດໃນການສ້າງການຈອງ';
            message.error(errorMessage);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Modal
            title="ເພີ່ມລາຍການການຈອງ"
            open={isModalOpen}
            onCancel={handleCloseModal}
            onOk={() => form.submit()}
            okText="ບັນທຶກ"
            cancelText="ຍົກເລີກ"
            confirmLoading={submitting}
            destroyOnClose // Important to reset form state when closing
        >
            <Spin spinning={loadingCustomers || loadingTables || submitting}>
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleSubmit}
                    name="bookingForm"
                    initialValues={{
                        customerToggle: false, // Default value for radio group
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
                                    { len: 10, message: 'ເບີໂທຕ້ອງມີ 10 ຫຼັກ!' }
                                ]}
                            >
                                <Input />
                            </Form.Item>
                        </>
                    )}

                    <Form.Item
                        name="tableId"
                        label="ເລືອກໂຕະ (ທີ່ວ່າງ)"
                        rules={[{ required: true, message: 'ກະລຸນາເລືອກໂຕະ' }]}
                    >
                        <Select placeholder="ເລືອກໂຕະ" loading={loadingTables}>
                            {tables.map(table => (
                                <Option key={table.id} value={table.id}>
                                    {`ໂຕະ ${table.table_number} (ບ່ອນນັ່ງ: ${table.seat})`}
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>

                    <Form.Item
                        name="reservationTime"
                        label="ວັນທີ ແລະ ເວລາຈອງ"
                        rules={[{ required: true, message: 'ກະລຸນາເລືອກວັນທີ ແລະ ເວລາຈອງ' }]}
                    >
                        <DatePicker
                            showTime={{ format: 'HH:mm' }} // Ensure time picker is shown
                            format="DD/MM/YYYY HH:mm"
                            style={{ width: '100%' }}
                            // Disable dates/times in the past
                            disabledDate={(current) => {
                                return current && current < moment().endOf('day').subtract(1, 'day'); // Disable all days before today
                            }}
                            disabledTime={(current) => {
                                if (!current) return {};
                                // Disable hours before current hour if the date is today
                                if (current.isSame(moment(), 'day')) {
                                    return {
                                        disabledHours: () => {
                                            const hours = [];
                                            for (let i = 0; i < moment().hour(); i++) {
                                                hours.push(i);
                                            }
                                            return hours;
                                        },
                                        disabledMinutes: (selectedHour) => {
                                            if (selectedHour === moment().hour()) {
                                                const minutes = [];
                                                for (let i = 0; i < moment().minute(); i++) {
                                                    minutes.push(i);
                                                }
                                                return minutes;
                                            }
                                            return [];
                                        }
                                    };
                                }
                                return {};
                            }}
                        />
                    </Form.Item>
                </Form>
            </Spin>
        </Modal>
    );
};

export default ModalBooking;