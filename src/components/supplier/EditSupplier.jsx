import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, Spin, message } from 'antd';
import axios from 'axios';
import ApiPath from '../../api/apiPath'; // Adjust path if necessary

const EditSupplier = ({ visible, supplierId, onClose, onSupplierUpdated }) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    // Fetch supplier data when the modal is visible and supplierId is valid
    useEffect(() => {
        if (visible && supplierId) {
            setLoading(true);
            const fetchSupplierData = async () => {
                try {
                    // Use getSupplierById endpoint
                    const response = await axios.get(`${ApiPath.getSupplierById}/${supplierId}`);
                    form.setFieldsValue(response.data); // Populate form
                } catch (error) {
                    console.error("Error fetching supplier data:", error);
                    message.error('ບໍ່ສາມາດໂຫຼດຂໍ້ມູນຜູ້ສະໜອງໄດ້');
                    onClose(); // Close modal on fetch error
                } finally {
                    setLoading(false);
                }
            };
            fetchSupplierData();
        } else {
            form.resetFields(); // Reset form when hidden or no ID
        }
    }, [visible, supplierId, form, onClose]);

    const handleSubmit = async (values) => {
        setSubmitting(true);
        try {
            console.log("Updating supplier with ID:", supplierId, "Data:", values);
            // Use updateSupplier endpoint
            const response = await axios.put(`${ApiPath.updateSupplier}/${supplierId}`, values);
            console.log("Update response:", response.data);
            message.success('ອັບເດດຂໍ້ມູນຜູ້ສະໜອງສຳເລັດ!');
            onSupplierUpdated(); // Trigger refresh in parent
            onClose(); // Close modal
        } catch (error) {
            console.error("Error updating supplier:", error.response?.data || error.message);
            let errorMessage = 'ເກີດຂໍ້ຜິດພາດໃນການອັບເດດຂໍ້ມູນຜູ້ສະໜອງ';
            if (error.response?.status === 404) {
                errorMessage = 'ບໍ່ພົບຂໍ້ມູນຜູ້ສະໜອງທີ່ຈະແກ້ໄຂ';
            }
            // Add checks for other potential errors (e.g., duplicate phone/email if validation exists)
            message.error(errorMessage);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Modal
            title="ແກ້ໄຂຂໍ້ມູນຜູ້ສະໜອງ"
            visible={visible}
            onCancel={onClose}
            onOk={() => form.submit()}
            okText="ບັນທຶກການແກ້ໄຂ"
            cancelText="ຍົກເລີກ"
            confirmLoading={submitting}
            destroyOnClose
        >
            <Spin spinning={loading}>
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleSubmit}
                    name="editSupplierForm"
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
            </Spin>
        </Modal>
    );
};

export default EditSupplier; 