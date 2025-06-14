import React, { useState } from 'react'
import Sidebar from '../sidebar/Sidebar'
import { Form, Input, message } from 'antd'
import { IoIosArrowBack } from 'react-icons/io'
import { useNavigate, useParams } from 'react-router-dom'
import { updateUnitApi } from '../../api/unit'

const FrmEditUnit = () => {
    const navigate = useNavigate()
    const { id } = useParams()
    const [unitName, setUnitName] = useState("")
    const token = localStorage.getItem('token')

    const handleOnChange = (e) => {
        setUnitName(e.target.value)
    }

    const handleSubmit = async () => {
        try {
            const response = await updateUnitApi(token, id, { "name": unitName })
            if (response) {
                message.success("ອັບເດດສຳເລັດ!!!")
                navigate(-1)
            }
        } catch (error) {
            message.error('ເກີດຂໍ້ຜິດພາດ!!!');
            console.error('Update error:', error);
        }
    }

    return (
        <Sidebar>
            <div className=' h-full flex items-center justify-center'>
                <div className=' bg-white flex flex-col justify-between py-8 px-4 w-[300px] h-[240px] rounded-md'>
                    <h1 className=' text-[18px] font-medium text-center'>ແກ້ໄຂຫົວໜ່ວຍສິນຄ້າ</h1>
                    <Form name="validateOnly" layout="vertical" autoComplete="off">
                        <Form.Item
                            name="name"
                            label="ຊື່ຫົວໜ່ວຍ"
                            rules={[
                                {
                                    required: true,
                                },
                            ]}
                        >
                            <Input
                                name="name"
                                value={unitName}
                                onChange={handleOnChange}
                                placeholder='ກະລຸນາປ້ອນຊື່...'
                            />
                        </Form.Item>
                    </Form>
                    <div className=' flex justify-center items-center gap-x-4'>
                        <button
                            onClick={() => navigate(-1)}
                            className=' bg-red-500 text-white w-[70px] py-1 rounded border-1 border-transparent hover:border-1 hover:bg-transparent hover:border-red-500 hover:text-red-500 duration-300 cursor-pointer'
                        >
                            ກັບຄືນ
                        </button>
                        <button
                            type='submit'
                            onClick={handleSubmit}
                            className=' bg-blue-500 text-white w-[70px] py-1 rounded border-1 border-transparent hover:border-1 hover:bg-transparent hover:border-blue-500 hover:text-blue-500 duration-300 cursor-pointer'
                        >
                            ບັນທຶກ
                        </button>
                    </div>
                </div>
            </div>
        </Sidebar>
    )
}

export default FrmEditUnit 