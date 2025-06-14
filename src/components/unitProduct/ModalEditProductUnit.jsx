import { Form, Input, InputNumber, message, Modal } from 'antd';
import React, { useState, useEffect } from 'react'
import { updateProductUnitApi } from '../../api/productUnit';
import { useAuth } from '../../context/AuthContext';
import { LiaSpinnerSolid } from "react-icons/lia";

const ModalEditProductUnit = ({ isModalOpen, setIsModalOpen, record, onSuccess }) => {
    const { user } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const [form] = Form.useForm();

    useEffect(() => {
        if (record) {
            form.setFieldsValue({
                name: record.name,
                price: record.price,
                drinkId: record.drinkId,
                baseItemsCount: record.baseItemsCount
            });
        }
    }, [record, form]);

    const handleOk = async () => {
        if (user?.role !== 'Owner' && user?.role !== 'Manager') {
            message.error('ທ່ານບໍ່ມີສິດແກ້ໄຂຫົວໜ່ວຍສິນຄ້າ!');
            setIsModalOpen(false);
            return;
        }

        try {
            const values = await form.validateFields();
            setIsLoading(true);
            const response = await updateProductUnitApi(user.token, record.id, values);
            if (response) {
                message.success("ແກ້ໄຂຫົວໜ່ວຍສິນຄ້າສຳເລັດ!!!");
                onSuccess();
                form.resetFields();
                setIsModalOpen(false);
            }
        } catch (error) {
            message.error('ເກີດຂໍ້ຜິດພາດ!!!');
            console.error('Update error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCancel = () => {
        setIsModalOpen(false);
        form.resetFields();
    };

    return (
        <Modal
            footer={null}
            open={isModalOpen}
            onCancel={handleCancel}
            title="ແກ້ໄຂຫົວໜ່ວຍສິນຄ້າ"
        >
            <Form
                form={form}
                name="editProductUnit"
                layout="vertical"
                autoComplete="off"
            >
                <Form.Item
                    name="name"
                    label="ຊື່ຫົວໜ່ວຍ"
                    rules={[{ required: true, message: 'ກະລຸນາປ້ອນຊື່' }]}
                >
                    <Input placeholder='ກະລຸນາປ້ອນຊື່...' />
                </Form.Item>

                <Form.Item
                    name="price"
                    label="ລາຄາ"
                    rules={[{ required: true, message: 'ກະລຸນາປ້ອນລາຄາ' }]}
                >
                    <InputNumber
                        className='w-full'
                        placeholder='ກະລຸນາປ້ອນລາຄາ...'
                        min={0}
                    />
                </Form.Item>

                <Form.Item
                    name="drinkId"
                    label="ID ເຄື່ອງດື່ມ"
                    rules={[{ required: true, message: 'ກະລຸນາປ້ອນ ID ເຄື່ອງດື່ມ' }]}
                >
                    <Input placeholder='ກະລຸນາປ້ອນ ID ເຄື່ອງດື່ມ...' />
                </Form.Item>

                <Form.Item
                    name="baseItemsCount"
                    label="ຈຳນວນພື້ນຖານ"
                    rules={[{ required: true, message: 'ກະລຸນາປ້ອນຈຳນວນ' }]}
                >
                    <InputNumber
                        className='w-full'
                        placeholder='ກະລຸນາປ້ອນຈຳນວນ...'
                        min={0}
                    />
                </Form.Item>
            </Form>
            <div className='flex justify-center items-center gap-x-4 mt-5'>
                <button
                    onClick={handleCancel}
                    disabled={isLoading}
                    className={`bg-red-500 text-white w-[80px] py-1 rounded border-1 border-transparent duration-300 cursor-pointer ${isLoading
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'hover:border-1 hover:bg-transparent hover:border-red-500 hover:text-red-500'
                        }`}
                >
                    ຍົກເລີກ
                </button>
                <button
                    onClick={handleOk}
                    disabled={isLoading}
                    className={`bg-blue-500 text-white w-[110px] py-1 rounded border-1 border-transparent duration-300 cursor-pointer flex items-center justify-center gap-1 ${isLoading
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'hover:border-1 hover:bg-transparent hover:border-blue-500 hover:text-blue-500'
                        }`}
                >
                    {isLoading ? (
                        <>
                            ກຳລັງບັນທຶກ <LiaSpinnerSolid className='animate-spin text-[16px]' />
                        </>
                    ) : (
                        'ບັນທຶກ'
                    )}
                </button>
            </div>
        </Modal>
    )
}

export default ModalEditProductUnit 