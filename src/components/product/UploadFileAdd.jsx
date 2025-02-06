import React, { useState } from 'react'
import { FaTrashAlt } from 'react-icons/fa'
import { FiLoader } from 'react-icons/fi'
import { MdOutlineCloudUpload } from 'react-icons/md'

const UploadFileAdd = ({ image, setImage }) => {
    const [isLoading, setIsLoading] = useState(false)


    const handleOnChange = (e) => {
        setIsLoading(true) // เริ่มการโหลด

        const file = e.target.files[0]; // รับไฟล์ที่ถูกเลือก
        if (file) {
            const reader = new FileReader(); // สร้าง FileReader
            reader.onloadend = () => {
                setImage(reader.result); // ตั้งค่าภาพที่อ่านได้
                setIsLoading(false); // เสร็จสิ้นการโหลด
            }
            reader.readAsDataURL(file); // อ่านไฟล์เป็น Data URL
        } else {
            setIsLoading(false); // เสร็จสิ้นการโหลดถ้าไม่มีไฟล์
        }
    }

    return (
        <div className=' w-full h-[240px]'>
            <div className=' flex justify-center items-center rounded-md h-full'>
                {
                    isLoading && (
                        <FiLoader className=' text-[20px] animate-spin' />
                    )
                }
                {
                    image ? (
                        <div className=' relative h-full border-2 rounded-md border-gray-300 border-dashed p-0.5'>
                            <img src={image}
                                className=' h-full object-cover rounded-r-md'
                                alt="" />
                            <div
                                onClick={() => setImage(null)}
                                className=' cursor-pointer bg-black/30 w-[30px] h-[30px] flex justify-center items-center rounded absolute top-2 right-2'>
                                <FaTrashAlt className=' text-white text-[18px]' />
                            </div>
                        </div>
                    ) : (
                        <div className=' w-full h-full rounded-md border-2 border-gray-300 border-dashed '>
                            <input id='uploadImage'
                                name='uploadImage'
                                onChange={handleOnChange}
                                type="file" hidden />
                            <label htmlFor='uploadImage' className='bg-white hover:bg-gray-100 duration-300 cursor-pointer w-full h-full flex flex-col justify-center items-center'>
                                <MdOutlineCloudUpload className=' text-[28px] text-gray-500' />
                                <p className=' text-[16px] font-medium text-gray-500'>ອັບໂຫຼດຮູບພາບ</p>
                            </label>
                        </div>
                    )
                }
            </div>
        </div>
    )
}

export default UploadFileAdd
