import React, { useEffect } from 'react';
import { Modal, Form, Input, Select, Button, message, Descriptions } from 'antd';
import useSafezoneStore from '../../store/safezoneStore';
import { updateEmployee } from '../../api/user';

const { Option } = Select;

const EditUserModal = ({ isOpen, onClose, initialValues }) => {
    const [form] = Form.useForm();
    const loggedInUser = useSafezoneStore((state) => state.user);
    const token = useSafezoneStore((state) => state.token);

    useEffect(() => {
        if (isOpen && initialValues) {
            form.setFieldsValue({
                role: initialValues.role,
                email: initialValues.email
            });
        } else if (!isOpen) {
            form.resetFields();
        }
    }, [isOpen, initialValues, form]);

    const handleSubmit = async (values) => {
        if (!initialValues?.id) {
            message.error('ບໍ່ພົບ ID ຂອງຜູ້ໃຊ້ທີ່ຈະອັບເດດ!');
            return;
        }
        if (!token) {
            message.error('ບໍ່ພົບ Token ສຳລັບການยืนยันตัวตน!');
            return;
        }

        try {
            const dataToSubmit = {
                role: values.role,
                ...(values.password && { password: values.password }),
            };

            await updateEmployee(token, initialValues.id, dataToSubmit);

            message.success('ອັບເດດຂໍ້ມູນຜູ້ໃຊ້ສຳເລັດແລ້ວ!');
            onClose();
        } catch (error) {
            console.error('Failed to update user:', error);
            const errorMsg = error.response?.data?.message || 'ການອັບເດດຂໍ້ມູນຜູ້ໃຊ້ລົ້ມເຫລວ!';
            message.error(errorMsg);
        }
    };

    const handleCancel = () => {
        onClose();
    };

    return (
        <Modal
            title="ແກ້ໄຂຕຳແໜ່ງ ແລະ ລະຫັດຜ່ານ"
            open={isOpen}
            onCancel={handleCancel}
            centered
            footer={[
                <Button key="back" onClick={handleCancel}>
                    ຍົກເລີກ
                </Button>,
                <Button key="submit" type="primary" onClick={() => form.submit()}>
                    ບັນທຶກ
                </Button>,
            ]}
            destroyOnClose
        >
            {loggedInUser && (
                <Descriptions title="ຂໍ້ມູນຜູ້ໃຊ້ທີ່ເຂົ້າສູ່ລະບົບ" bordered size="small" column={1} style={{ marginBottom: '20px' }}>
                    <Descriptions.Item label="ຊື່">{`${loggedInUser.fname || ''} ${loggedInUser.lname || ''}`}</Descriptions.Item>
                    <Descriptions.Item label="ອີເມລ">{loggedInUser.email || 'N/A'}</Descriptions.Item>
                    <Descriptions.Item label="ຕຳແໜ່ງປະຈຸບັນ">{loggedInUser.role || 'N/A'}</Descriptions.Item>
                </Descriptions>
            )}

            <p><b>ກຳລັງແກ້ໄຂຜູ້ໃຊ້:</b> {initialValues?.email || 'N/A'}</p>

            <Form
                form={form}
                layout="vertical"
                onFinish={handleSubmit}
                initialValues={{
                    role: initialValues?.role,
                    email: initialValues?.email
                }}
            >
                <Form.Item
                    name="email"
                    label="ອີເມລ (ຂອງຜູ້ໃຊ້ທີ່ກຳລັງແກ້ໄຂ)"
                    rules={[
                        { required: true, message: 'ອີເມລບໍ່ຄວນວ່າງ!' },
                        { type: 'email', message: 'ຮູບແບບອີເມລບໍ່ຖືກຕ້ອງ!' }
                    ]}
                >
                    <Input placeholder="ອີເມລ" disabled={true} />
                </Form.Item>
                <Form.Item
                    name="password"
                    label="ລະຫັດຜ່ານໃໝ່ (ປ່ອຍວ່າງຖ້າບໍ່ຕ້ອງການປ່ຽນ)"
                    rules={[
                        {
                            required: false,
                        },
                        ({ getFieldValue }) => ({
                            validator(_, value) {
                                if (!value || getFieldValue('confirmPassword') === value) {
                                    if (form.isFieldTouched('confirmPassword') && getFieldValue('confirmPassword') !== value) {
                                        form.validateFields(['confirmPassword']);
                                    } else if (!getFieldValue('confirmPassword') && form.isFieldTouched('confirmPassword')) {
                                        form.validateFields(['confirmPassword']);
                                    }
                                    return Promise.resolve();
                                }
                                return Promise.reject(new Error('ລະຫັດຜ່ານໃໝ່ທັງສອງຊ່ອງບໍ່ກົງກັນ!'));
                            },
                        }),
                    ]}
                    hasFeedback
                >
                    <Input.Password placeholder="ປ້ອນລະຫັດຜ່ານໃໝ່" />
                </Form.Item>
                <Form.Item
                    name="confirmPassword"
                    label="ຢືນຢັນລະຫັດຜ່ານໃໝ່"
                    dependencies={['password']}
                    hasFeedback
                    rules={[
                        ({ getFieldValue }) => ({
                            required: !!getFieldValue('password'),
                            message: 'ກະລຸນາຢືນຢັນລະຫັດຜ່ານໃໝ່!',
                        }),
                        ({ getFieldValue }) => ({
                            validator(_, value) {
                                if (!getFieldValue('password') || !value) {
                                    return Promise.resolve();
                                }
                                if (getFieldValue('password') === value) {
                                    return Promise.resolve();
                                }

                                return Promise.reject(new Error('ລະຫັດຜ່ານໃໝ່ທັງສອງຊ່ອງບໍ່ກົງກັນ!'));
                            },
                        }),
                    ]}
                >
                    <Input.Password placeholder="ຢືນຢັນລະຫັດຜ່ານໃໝ່" />
                </Form.Item>
                <Form.Item
                    name="role"
                    label="ຕຳແໜ່ງໃໝ່ (ສຳລັບຜູ້ໃຊ້ທີ່ກຳລັງແກ້ໄຂ)"
                    rules={[{ required: true, message: 'ກະລຸນາເລືອກ Role!' }]}
                >
                    <Select placeholder="ເລືອກ Role">
                        <Option value="Manager">Manager</Option>
                        <Option value="Cashier">Cashier</Option>
                        <Option value="Chef">Chef</Option>
                        <Option value="Waiter">Waiter</Option>
                    </Select>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default EditUserModal; 