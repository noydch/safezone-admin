import { Form, Input, Modal } from 'antd'
import React, { useState } from 'react'
import { insertTableApi } from '../../api/table';
import useSafezoneStore from '../../store/safezoneStore';

const ModalAddTable = ({ listTable }) => {
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
        try {
            const response = await insertTableApi(token, values)
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
                className='h-[35px] w-[100px] rounded bg-red-500 text-center text-white border-2 border-transparent hover:border-2 hover:bg-transparent hover:border-red-500 hover:text-red-500 duration-300 cursor-pointer'>
                ເພີ່ມໂຕະ
            </button>
            <Modal
                open={isModalOpen} onOk={() => form.submit()} onCancel={handleCancel}>
                <h1 className=' text-center text-[20px] font-semibold mb-5'>
                    ຟອມເພີ່ມໂຕະ
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

export default ModalAddTable