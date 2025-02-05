import React from 'react'
import Sidebar from '../sidebar/Sidebar'
import { Form, Input } from 'antd'
import { IoIosArrowBack } from 'react-icons/io'
import { useNavigate } from 'react-router-dom'

const FrmEditCategory = () => {
    const navigate = useNavigate()
    return (
        <Sidebar>
            <div className=' h-full flex items-center justify-center'>
                <div className=' bg-white flex flex-col justify-between py-8 px-4 w-[300px] h-[240px] rounded-md'>
                    <h1 className=' text-[18px] font-medium text-center'>ແກ້ໄຂປະເພດອາຫານ - ເຄື່ອງດື່ມ</h1>
                    <Form name="validateOnly" layout="vertical" autoComplete="off"
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
                            <Input />
                        </Form.Item>
                    </Form>
                    <div className=' flex justify-center items-center gap-x-4'>
                        <button onClick={() => navigate(-1)}
                            className=' bg-red-500 text-white w-[70px] py-1 rounded border-1 border-transparent hover:border-1 hover:bg-transparent hover:border-red-500 hover:text-red-500 duration-300 cursor-pointer'>
                            ກັບຄືນ
                        </button>
                        <button
                            className=' bg-blue-500 text-white w-[70px] py-1 rounded border-1 border-transparent hover:border-1 hover:bg-transparent hover:border-blue-500 hover:text-blue-500 duration-300 cursor-pointer'>
                            ບັນທຶກ
                        </button>
                    </div>
                </div>
            </div>
        </Sidebar>
    )
}

export default FrmEditCategory
