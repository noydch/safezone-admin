import React, { useState } from 'react';
import { Modal, Form, Input, Select, DatePicker, Row, Col, message } from 'antd';
import dayjs from 'dayjs';
import axios from 'axios';
import ApiPath from '../../api/apiPath';

const ModalRegister = ({ isOpen, onClose, onSubmit }) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (values) => {
        try {
            setLoading(true);
            // Format the date to YYYY-MM-DD
            const formattedValues = {
                ...values,
                dob: values.dob.format('YYYY-MM-DD')
            };

            const response = await axios.post(ApiPath.register, formattedValues);

            if (response.data === "Register Successfully!!!") {
                message.success('Registration successful!');
                form.resetFields();
                onClose();
                if (onSubmit) onSubmit();
            }
        } catch (error) {
            if (error.response?.data?.message) {
                message.error(error.response.data.message);
            } else {
                message.error('Registration failed. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal
            open={isOpen}
            onCancel={onClose}
            okText="Register"
            onOk={() => form.submit()}
            confirmLoading={loading}
            style={{
                top: '50%',
                transform: 'translateY(-50%)'
            }}
        >
            <Form
                form={form}
                layout="vertical"
                onFinish={handleSubmit}
                initialValues={{
                    role: 'Waiter', // Updated to match enum value
                }}
            >
                <h1 className=' text-center text-[20px] font-semibold my-5'>ຟອມເພີ່ມຜູ້ໃຊ້ງານ</h1>
                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                            name="fname"
                            label="ຊື່"
                            rules={[{ required: true, message: 'Please input first name!' }]}
                        >
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name="lname"
                            label="ນາມສະກຸນ"
                            rules={[{ required: true, message: 'Please input last name!' }]}
                        >
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name="gender"
                            label="ເພດ"
                            rules={[{ required: true, message: 'Please select gender!' }]}
                        >
                            <Select>
                                <Select.Option value="Male">ຊາຍ</Select.Option>
                                <Select.Option value="Female">ຍິງ</Select.Option>
                                <Select.Option value="Other">ອື່ນໆ</Select.Option>
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name="phone"
                            label="ເບີໂທ"
                            rules={[
                                { required: true, message: 'Please input phone number!' },
                                { pattern: /^\d+$/, message: 'Please input valid phone number!' }
                            ]}
                        >
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name="dob"
                            label="ວັນເດືອນປີເກີດ"
                            rules={[{ required: true, message: 'Please select date of birth!' }]}
                        >
                            <DatePicker
                                style={{ width: '100%' }}
                                format="YYYY-MM-DD"
                            />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name="role"
                            label="ສິດຜູ້ໃຊ້"
                            rules={[{ required: true, message: 'Please select role!' }]}
                        >
                            <Select>
                                <Select.Option value="Owner">Owner</Select.Option>
                                <Select.Option value="Manager">Manager</Select.Option>
                                <Select.Option value="Cashier">Cashier</Select.Option>
                                <Select.Option value="Chef">Chef</Select.Option>
                                <Select.Option value="Waiter">Waiter</Select.Option>
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name="email"
                            label="ອີເມລ"
                            rules={[
                                { required: true, message: 'Please input email!' },
                                { type: 'email', message: 'Please enter a valid email!' }
                            ]}
                        >
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name="password"
                            label="ລະຫັດຜ່ານ"
                            rules={[{ required: true, message: 'Please input password!' }]}
                        >
                            <Input.Password />
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
        </Modal>
    );
};

export default ModalRegister;