import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, Spin, message } from 'antd';
import axios from 'axios';
import ApiPath from '../../api/apiPath';

const EditCustomer = ({ open, customerId, onClose, onCustomerUpdated }) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    // Fetch customer data when the modal becomes visible and customerId is valid
    useEffect(() => {
        if (open && customerId) {
            setLoading(true);
            const fetchCustomerData = async () => {
                try {
                    const response = await axios.get(`${ApiPath.getCustomerById}/${customerId}`);
                    form.setFieldsValue(response.data); // Populate form with fetched data
                } catch (error) {
                    console.error("Error fetching customer data:", error);
                    message.error('ບໍ່ສາມາດໂຫຼດຂໍ້ມູນລູກຄ້າທີ່ຈະແກ້ໄຂໄດ້');
                    onClose(); // Close modal if fetch fails
                } finally {
                    setLoading(false);
                }
            };
            fetchCustomerData();
        }
    }, [open, customerId, form, onClose]);

    const handleSubmit = async (values) => {
        setSubmitting(true);
        try {
            console.log("Updating customer with ID:", customerId, "Data:", values);
            const response = await axios.put(`${ApiPath.updateCustomer}/${customerId}`, values);
            console.log("Update response:", response.data);
            message.success('ອັບເດດຂໍ້ມູນລູກຄ້າສຳເລັດ!');
            onCustomerUpdated(); // Trigger data refresh in parent
            onClose(); // Close the modal
        } catch (error) {
            console.error("Error updating customer:", error.response?.data || error.message);
            let errorMessage = 'ເກີດຂໍ້ຜິດພາດໃນການອັບເດດຂໍ້ມູນລູກຄ້າ';
            // Check for specific 409 conflict error (duplicate phone)
            if (error.response?.status === 409) {
                errorMessage = error.response.data.message || 'ເບີໂທນີ້ມີລູກຄ້າຄົນອື່ນໃຊ້ແລ້ວ';
            }
            // Check for 404 Not Found
            else if (error.response?.status === 404) {
                errorMessage = 'ບໍ່ພົບຂໍ້ມູນລູກຄ້າທີ່ຈະແກ້ໄຂ';
            }
            message.error(errorMessage);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Modal
            title="ແກ້ໄຂຂໍ້ມູນລູກຄ້າ"
            open={open}
            onCancel={onClose} // Use onClose prop for Cancel button
            onOk={() => form.submit()} // Trigger form submission on OK
            okText="ບັນທຶກການແກ້ໄຂ"
            cancelText="ຍົກເລີກ"
            confirmLoading={submitting} // Loading state for OK button
            destroyOnClose // Reset form state when modal is closed
        >
            <Spin spinning={loading}>
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleSubmit}
                    name="editCustomerForm"
                >
                    <Form.Item
                        name="fname"
                        label="ຊື່ແທ້"
                        rules={[{ required: true, message: 'ກະລຸນາປ້ອນຊື່ແທ້' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="lname"
                        label="ນາມສະກຸນ"
                        rules={[{ required: true, message: 'ກະລຸນາປ້ອນນາມສະກຸນ' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="phone"
                        label="ເບີໂທ"
                        rules={[{ required: true, message: 'ກະລຸນາປ້ອນເບີໂທ' }]}
                    >
                        <Input />
                    </Form.Item>
                </Form>
            </Spin>
        </Modal>
    );
};

export default EditCustomer; 