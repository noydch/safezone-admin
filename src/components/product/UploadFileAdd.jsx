import React, { useState } from 'react'
import { toast } from 'react-toastify'
import Resize from 'react-image-file-resizer'
// import useEcomStore from '../../store/ecom-store'
import { ImSpinner } from "react-icons/im";
import { Loader } from 'lucide-react'
import { FaTrashAlt } from 'react-icons/fa'
import { MdOutlineCloudUpload } from 'react-icons/md'

// Changed props to form and setForm
const UploadFileAdd = ({ form, setForm }) => {
    // const token = useEcomStore((state) => state.token)
    const token = localStorage.getItem('token')
    const [isLoading, setIsLoading] = useState(false)

    const handleOnChange = (e) => {
        setIsLoading(true)
        const files = e.target.files
        if (files) {
            let allFiles = form.image || []
            for (let i = 0; i < files.length; i++) {
                const file = files[i]
                if (!file.type.startsWith('image/')) {
                    toast.error(`File ${file.name} บ่แม่นรูป`)
                    continue
                }

                Resize.imageFileResizer(
                    files[i],
                    720,
                    720,
                    "JPEG",
                    100,
                    0,
                    (data) => {
                        // สร้าง object จำลองข้อมูลรูปภาพ
                        const newImage = {
                            public_id: Date.now().toString(),
                            url: data
                        }

                        // ตรวจสอบรูปซ้ำ
                        const isDuplicate = allFiles.some(img => img.url === data)
                        if (isDuplicate) {
                            toast.error('รูปภาพนี้มีอยู่แล้ว')
                            setIsLoading(false)
                            return
                        }

                        allFiles = [...allFiles, newImage]
                        setForm({
                            ...form,
                            image: allFiles
                        })
                        setIsLoading(false)
                        toast.success('Upload image Success!!!')
                    },
                    "base64"
                )
            }
        }
    }

    const handleDelete = (public_id) => {
        const filterImage = form.image.filter((item) => {
            return item.public_id !== public_id
        })
        setForm({
            ...form,
            image: filterImage
        })
        toast.success('Image deleted successfully')
    }

    return (
        <div className='w-full h-[240px]'>
            <div className='flex flex-wrap gap-4 h-full'>
                {isLoading ? (
                    <div className=' rounded-md border-2 border-gray-300 border-dashed flex justify-center items-center h-full w-full'>
                        <div className=' flex items-center gap-x-2'>
                            <p className=' text-[18px]'>ກຳລັງອັບໂຫຼດຮູບພາບ</p>
                            <ImSpinner className='w-[26px] h-[26px] animate-spin' />
                        </div>
                    </div>
                ) : (
                    form.image && form.image.length > 0 ? (
                        form.image.map((item, index) => (
                            <div key={index} className='relative h-full border-2 rounded-md border-gray-300 border-dashed p-0.5'>
                                <img
                                    src={item.url}
                                    className='h-full object-cover rounded-md'
                                    alt=""
                                />
                                <div
                                    onClick={() => handleDelete(item.public_id)}
                                    className='cursor-pointer bg-black/30 w-[30px] h-[30px] flex justify-center items-center rounded absolute top-2 right-2'>
                                    <FaTrashAlt className='text-white text-[18px]' />
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className='w-[200px] h-full rounded-md border-2 border-gray-300 border-dashed'>
                            <input
                                id='uploadImage'
                                name='uploadImage'
                                onChange={handleOnChange}
                                type="file"
                                multiple
                                hidden
                            />
                            <label
                                htmlFor='uploadImage'
                                className='bg-white hover:bg-gray-100 duration-300 cursor-pointer w-full h-full flex flex-col justify-center items-center'
                            >
                                <MdOutlineCloudUpload className='text-[28px] text-gray-500' />
                                <p className='text-[16px] font-medium text-gray-500'>ອັບໂຫຼດຮູບພາບ</p>
                            </label>
                        </div>
                    )
                )}
            </div>
        </div>
    )
}

export default UploadFileAdd