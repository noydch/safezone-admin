import { Form, Input, Modal } from 'antd'
import React, { useState } from 'react'
import { insertTableApi, updateTableApi } from '../../api/table';
import useSafezoneStore from '../../store/safezoneStore';

const ModalEditTable = ({ listTable, tableId }) => {
    const [form] = Form.useForm();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const token = useSafezoneStore((state) => state.token)

    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    const onFinish = async (values) => {
        // console.log('Form submitted:', token);
        // console.log(tableId);
        try {
            const response = await updateTableApi(token, tableId, values)

            if (response) {
                form.resetFields();
                listTable()
                setIsModalOpen(false);
            }
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div>
            <button onClick={showModal}
                className=' bg-blue-500 text-[12px] text-white w-[50px] py-0.5 rounded border-1 border-transparent hover:border-1 hover:bg-transparent hover:border-blue-500 hover:text-blue-500 duration-300 cursor-pointer'>
                ແກ້ໄຂ
            </button>
            <Modal
                open={isModalOpen} onOk={() => form.submit()} onCancel={handleCancel}>
                <h1 className=' text-center text-[20px] font-semibold mb-5'>
                    ຟອມແກ້ໄຂໂຕະ
                </h1>
                <Form
                    form={form}
                    layout='vertical'
                    initialValues={{
                        role: 'admin'
                    }}
                    onFinish={onFinish}
                >
                    <Form.Item
                        name={"table_number"}
                        label="ເລກໂຕະ"
                        rules={[{
                            required: true,
                            message: 'ກະລຸນາປ້ອນໝາຍເລກໂຕະ'
                        }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name={"seat"}
                        label="ບ່ອນນັ່ງ"
                        rules={[{
                            required: true,
                            message: 'ກະລຸນາປ້ອນໝາຍຈຳນວນບ່ອນນັ່ງ'
                        }]}
                    >
                        <Input />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    )
}

export default ModalEditTable