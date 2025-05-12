import React, { useState } from 'react';
import { Modal, Form, Input, Select, DatePicker, Row, Col } from 'antd';
import dayjs from 'dayjs';

const ModalRegister = ({ isOpen, onClose, onSubmit }) => {
    const [form] = Form.useForm();


    return (
        <Modal
            open={isOpen}
            onCancel={onClose}
            okText="Register"
            onOk={() => form.submit()}
            style={{
                top: '50%',
                transform: 'translateY(-50%)'
            }}
        >
            <Form
                form={form}
                layout="vertical"
                // onFinish={handleSubmit}
                initialValues={{
                    role: 'waiter', // ค่าเริ่มต้นตาม schema
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
                                <Select.Option value="waiter">Waiter</Select.Option>
                                <Select.Option value="chef">Chef</Select.Option>
                                <Select.Option value="manager">Manager</Select.Option>
                                <Select.Option value="cashier">Cashier</Select.Option>
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