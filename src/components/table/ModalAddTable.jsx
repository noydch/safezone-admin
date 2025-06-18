import { Form, Input, Modal, DatePicker } from 'antd'
import React, { useState } from 'react'
import { insertTableApi } from '../../api/table';
import useSafezoneStore from '../../store/safezoneStore';
import { LiaSpinnerSolid } from "react-icons/lia";
import moment from 'moment';

const ModalAddTable = ({ listTable }) => {
    const [form] = Form.useForm();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const token = useSafezoneStore((state) => state.token)

    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    const onFinish = async (values) => {
        setLoading(true);
        try {
            const formattedValues = {
                ...values,
                reservationTime: values.reservationTime ? moment(values.reservationTime).format() : null
            };

            console.log('Sending data:', formattedValues);
            const response = await insertTableApi(token, formattedValues)
            if (response) {
                form.resetFields();
                listTable()
                setIsModalOpen(false);
            }
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <button onClick={showModal}
                className='h-[35px] w-[100px] rounded bg-red-500 text-center text-white border-2 border-transparent hover:border-2 hover:bg-transparent hover:border-red-500 hover:text-red-500 duration-300 cursor-pointer'>
                ເພີ່ມໂຕະ
            </button>
            <Modal
                open={isModalOpen}
                onOk={() => form.submit()}
                onCancel={handleCancel}
                footer={null}>
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
                    <Form.Item
                        name={"reservationTime"}
                        label="ວັນທີ ແລະ ເວລາຈອງ"
                        rules={[{
                            required: true,
                            message: 'ກະລຸນາເລືອກວັນທີ ແລະ ເວລາຈອງ'
                        }]}
                    >
                        <DatePicker
                            showTime
                            format="DD/MM/YYYY HH:mm"
                            placeholder="ເລືອກວັນທີ ແລະ ເວລາຈອງ"
                        />
                    </Form.Item>
                </Form>
                <div className='flex justify-center items-center gap-x-4 mt-5'>
                    <button onClick={handleCancel}
                        className='bg-red-500 text-white w-[100px] py-1 rounded border-1 border-transparent hover:border-1 hover:bg-transparent hover:border-red-500 hover:text-red-500 duration-300 cursor-pointer'>
                        ຍົກເລີກ
                    </button>
                    <button onClick={() => form.submit()}
                        className='bg-blue-500 text-white w-[100px] flex items-center justify-center py-1 rounded border-1 border-transparent hover:border-1 hover:bg-transparent hover:border-blue-500 hover:text-blue-500 duration-300 cursor-pointer'>
                        {loading ? (
                            <p className='flex items-center gap-x-1.5'>
                                <span>ກຳລັງບັນທຶກ</span>
                                <LiaSpinnerSolid className='animate-spin text-[20px]' />
                            </p>
                        ) : "ບັນທຶກ"}
                    </button>
                </div>
            </Modal>
        </div>
    )
}

export default ModalAddTable