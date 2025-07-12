import React, { useState, useEffect } from 'react';
import { Form, Input, message, Modal } from 'antd';
import { updateUnitApi } from '../../api/unit';
import { useAuth } from '../../context/AuthContext'; // Import useAuth
import { LiaSpinnerSolid } from "react-icons/lia"; // For loading spinner

// Rename this component to ModalEditUnit if you also rename the file
const FrmEditUnit = ({ isModalOpen, handleCancel, unit, onSuccess, fetchUnits }) => {
    const { user } = useAuth(); // Get user from AuthContext
    const [isLoading, setIsLoading] = useState(false);
    const [form] = Form.useForm(); // Use Ant Design form instance

    useEffect(() => {
        // Set form fields when the unit prop changes (i.e., when modal opens with new data)
        if (unit) {
            form.setFieldsValue({ name: unit.name });
        }
    }, [unit, form]);

    const handleOk = async () => {
        if (user?.role !== 'Owner' && user?.role !== 'Manager') {
            message.error('ທ່ານບໍ່ມີສິດໃນການແກ້ໄຂຫົວໜ່ວຍ!');
            handleCancel();
            return;
        }

        try {
            const values = await form.validateFields(); // Validate form fields
            setIsLoading(true);

            const response = await updateUnitApi(user.token, unit.id, { "name": values.name });
            if (response) {
                message.success("ອັບເດດສຳເລັດ!!!");
                onSuccess(); // Call onSuccess callback from parent
                fetchUnits()
                handleCancel(); // Close modal
            }
        } catch (error) {
            if (error.errorFields) {
                // Ant Design form validation failed, message will be shown by Form.Item
                console.error('Validation Failed:', error);
            } else {
                message.error('ເກີດຂໍ້ຜິດພາດ!!!');
                console.error('Update error:', error);
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Modal footer={null} open={isModalOpen} onCancel={handleCancel}>
            <Form
                form={form}
                name="validateOnly"
                layout="vertical"
                autoComplete="off"
            >
                <h1 className=' text-[18px] font-medium text-center'>ແກ້ໄຂຫົວໜ່ວຍສິນຄ້າ</h1>
                <Form.Item
                    name="name"
                    label="ຊື່ຫົວໜ່ວຍ"
                    rules={[
                        {
                            required: true,
                            message: 'ກະລຸນາປ້ອນຊື່ຫົວໜ່ວຍ!',
                        },
                    ]}
                >
                    <Input
                        placeholder='ກະລຸນາປ້ອນຊື່...'
                    />
                </Form.Item>
            </Form>
            <div className=' flex justify-center items-center gap-x-4'>
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
                    type='button' // Changed to button type to prevent default submit
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
    );
};

export default FrmEditUnit; 