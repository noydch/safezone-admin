import { Button, Form, Input, message, Modal, Space, Table, Tag } from 'antd';
import React, { useEffect, useState } from 'react'
import { insetCategoryApi } from '../../api/category';
import useSafezoneStore from '../../store/safezoneStore';

const ModalAdd = ({ token }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [cateogryName, setCategoryName] = useState("")
    const listCategory = useSafezoneStore((state) => state.listCategory)
    const categories = useSafezoneStore((state) => state.categories)

    // Add form instance
    const [form] = Form.useForm();

    const handleOk = async () => {
        try {
            const response = await insetCategoryApi(token, { "name": cateogryName })
            if (response) {
                message.success("ເພີ່ມປະເພດສຳເລັດ!!!")
                listCategory()
                // Clear the form
                setCategoryName("")
                form.resetFields()
            }

        } catch (error) {
            message.error('ເກີດຂໍ້ຜິດພາດ!!!');
            console.error('Delete error:', error);
        }
        setIsModalOpen(false);
    };
    const showModal = () => {
        setIsModalOpen(true);
    };
    const handleCancel = () => {
        setIsModalOpen(false);
    };


    return (
        <div className='mb-2 flex items-center justify-between'>
            <h1 className='text-[18px] font-medium'>ປະເພດອາຫານ ແລະ ເຄື່ອງດື່ມ</h1>
            <button
                onClick={showModal}
                className='h-[35px] w-[120px] rounded bg-red-500 text-center text-white border-2 border-transparent hover:border-2 hover:bg-transparent hover:border-red-500 hover:text-red-500 duration-300 cursor-pointer'
            >
                ເພີ່ມປະເພດ
            </button>
            <Modal footer={null} open={isModalOpen} onCancel={handleCancel}>
                <h1 className='text-center text-[18px] font-medium mb-5'>
                    ເພີ່ມປະເພດອາຫານ - ເຄື່ອງດື່ມ
                </h1>
                <Form
                    form={form}
                    name="validateOnly"
                    layout="vertical"
                    autoComplete="off"
                >
                    <Form.Item
                        name="name"
                        label="ຊື່ປະເພດ"
                        rules={[
                            {
                                required: true,
                            },
                        ]}
                    >
                        <Input
                            name='name'
                            placeholder='ກະລຸນາປ້ອນຊື່...'
                            onChange={(e) => setCategoryName(e.target.value)}
                        />
                    </Form.Item>
                </Form>
                <div className='flex justify-center items-center gap-x-4 mt-5'>
                    <button
                        onClick={handleCancel}
                        className='bg-red-500 text-white w-[70px] py-1 rounded border-1 border-transparent hover:border-1 hover:bg-transparent hover:border-red-500 hover:text-red-500 duration-300 cursor-pointer'
                    >
                        ຍົກເລີກ
                    </button>
                    <button
                        onClick={handleOk}
                        className='bg-blue-500 text-white w-[70px] py-1 rounded border-1 border-transparent hover:border-1 hover:bg-transparent hover:border-blue-500 hover:text-blue-500 duration-300 cursor-pointer'
                    >
                        ບັນທຶກ
                    </button>
                </div>
            </Modal>
        </div>

    )
}

export default ModalAdd