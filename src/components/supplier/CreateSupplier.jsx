import React, { useState } from 'react';
import { Modal, Form, Input, Spin, message } from 'antd';
import axios from 'axios';
import ApiPath from '../../api/apiPath'; // Adjust path if necessary

const CreateSupplier = ({ visible, onClose, onSupplierCreated }) => {
    const [form] = Form.useForm();
    // No loading state needed as we don't fetch data initially
    const [submitting, setSubmitting] = useState(false);

    // No useEffect needed to fetch data

    const handleSubmit = async (values) => {
        setSubmitting(true);
        try {
            console.log("Creating supplier with data:", values);
            // Use createSupplier endpoint
            const response = await axios.post(ApiPath.createSupplier, values);
            console.log("Create response:", response.data);
            message.success('ເພີ່ມຜູ້ສະໜອງໃໝ່ສຳເລັດ!');
            form.resetFields(); // Reset form fields after successful creation
            onSupplierCreated(); // Trigger refresh in parent
            onClose(); // Close modal
        } catch (error) {
            console.error("Error creating supplier:", error.response?.data || error.message);
            let errorMessage = 'ເກີດຂໍ້ຜິດພາດໃນການເພີ່ມຜູ້ສະໜອງ';
            // Add checks for potential errors like duplicates if backend returns specific status codes
            // if (error.response?.status === 409) { ... }
            message.error(errorMessage);
        } finally {
            setSubmitting(false);
        }
    };

    // Function to handle modal cancel
    const handleCancel = () => {
        form.resetFields(); // Reset form if cancel button is clicked
        onClose();
    };

    return (
        <Modal
            title="ເພີ່ມຜູ້ສະໜອງໃໝ່"
            visible={visible}
            onCancel={handleCancel} // Use custom cancel handler
            onOk={() => form.submit()}
            okText="ບັນທຶກ"
            cancelText="ຍົກເລີກ"
            confirmLoading={submitting}
            destroyOnClose // Good practice to destroy form state on close
        >
            {/* No initial loading Spin needed */}
            <Form
                form={form}
                layout="vertical"
                onFinish={handleSubmit}
                name="createSupplierForm"
            >
                <Form.Item
                    name="name"
                    label="ຊື່ຜູ້ສະໜອງ"
                    rules={[{ required: true, message: 'ກະລຸນາປ້ອນຊື່ຜູ້ສະໜອງ' }]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    name="address"
                    label="ທີ່ຢູ່"
                    rules={[{ required: true, message: 'ກະລຸນາປ້ອນທີ່ຢູ່' }]}
                >
                    <Input.TextArea rows={3} />
                </Form.Item>
                <Form.Item
                    name="phone"
                    label="ເບີໂທ"
                    rules={[{ required: true, message: 'ກະລຸນາປ້ອນເບີໂທ' }]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    name="email"
                    label="ອີເມລ"
                    rules={[
                        { required: true, message: 'ກະລຸນາປ້ອນອີເມລ' },
                        { type: 'email', message: 'ຮູບແບບອີເມລບໍ່ຖືກຕ້ອງ' },
                    ]}
                >
                    <Input />
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default CreateSupplier; 