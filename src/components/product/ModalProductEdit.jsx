import { Modal, Select } from 'antd';
import React, { useState, useEffect } from 'react'
import UploadFileAdd from './UploadFileAdd';
import { useNavigate } from 'react-router-dom';
import UploadFileEdit from './UploadFileEdit';
import { MdOutlineCloudUpload } from 'react-icons/md';
import { FaTrash, FaTrashAlt } from 'react-icons/fa';
// import { toast } from 'react-hot-toast';
import { updateFoodApi, updateDrinkApi } from '../../api/product'; // นำเข้าฟังก์ชัน API
import useSafezoneStore from '../../store/safezoneStore';

const ModalProductEdit = ({ product, isDrink }) => {
    const [isSelected, setIsSelected] = useState('ທັງໝົດ')
    const navigate = useNavigate()
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [images, setImages] = useState([]);
    const [pName, setPName] = useState('');
    const [categoryId, setCategoryId] = useState('ເລືອກປະເພດ');
    const [quantity, setQuantity] = useState(0);
    const [price, setPrice] = useState(0);
    const [productId, setProductId] = useState(null);
    const categories = useSafezoneStore((state) => state.categories)
    // const listCategory = useSafezoneStore((state))

    // ใช้ useEffect เพื่อกำหนดค่าเริ่มต้นเมื่อ product เปลี่ยน
    useEffect(() => {
        if (product) {
            setProductId(product.id); // กำหนด productId
            setPName(product.name);
            setCategoryId(product.categoryId);
            setQuantity(product.qty);
            setPrice(product.price);
            setImages(product.image); // กำหนดภาพถ้าจำเป็น
        }
    }, [product]);

    const handleChange = (e) => {
        console.log(e.target.name + " : " + e.target.value);
        switch (e.target.name) {
            case 'name':
                setPName(e.target.value);
                break;
            case 'quantity':
                setQuantity(e.target.value);
                break;
            case 'price':
                setPrice(e.target.value);
                break;
            default:
                break;
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token'); // ดึง token จาก localStorage
        const data = {
            name: pName,
            categoryId: categoryId,
            qty: quantity,
            price: price,
            image: images // ส่งข้อมูลภาพไปด้วย
        };

        let response;
        if (isDrink) {
            response = await updateDrinkApi(token, productId, data); // เรียกใช้ updateDrinkApi
        } else {
            response = await updateFoodApi(token, productId, data); // เรียกใช้ updateFoodApi
        }

        if (response) {
            console.log("Update successful");
        } else {
            console.error("Update failed");
        }
    }

    const showModal = () => {
        setIsModalOpen(true);
    };
    const handleOk = () => {
        setIsModalOpen(false);
    };
    const handleCancel = () => {
        setIsModalOpen(false);
    };
    console.log(images);

    const handleOnChange = (e) => {
        const files = e.target.files;
        if (files && files.length > 0) {
            const file = files[0]; // Allow only the first file
            if (!file.type.startsWith('image/')) {
                toast.error(`File ${file.name} บ่แม่นรูป`);
                return;
            }

            const reader = new FileReader();
            reader.onloadend = () => {
                const newImage = {
                    public_id: Date.now().toString(),
                    url: reader.result
                };
                setImages([newImage]); // Set the state to only the new image
            };
            reader.readAsDataURL(file);
        }
    }

    return (
        <div>
            <button onClick={showModal}
                className=' bg-blue-500 text-[12px] text-white w-[50px] py-0.5 rounded border-1 border-transparent hover:border-1 hover:bg-transparent hover:border-blue-500 hover:text-blue-500 duration-300 cursor-pointer'>
                ແກ້ໄຂ
            </button>
            <Modal footer={null} open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
                <h1 className=' text-center text-[20px] font-semibold mb-5'>
                    ແກ້ໄຂອາຫານ - ເຄື່ອງດື່ມ
                </h1>
                <form action=""
                    className='flex gap-2 w-full h-[240px]'
                >
                    <div className=' flex-1 h-full flex justify-center items-center'>
                        {
                            images.length > 0 ? (
                                <div className='w-full h-full flex flex-wrap gap-2'>
                                    {images.map((item, index) => (
                                        <div key={index} className='relative h-full border-2 rounded-md border-gray-300 border-dashed p-0.5'>
                                            <img
                                                src={item.url}
                                                className='h-full object-cover rounded-md'
                                                alt=""
                                            />
                                            <div
                                                onClick={() => setImages([])} // Clear the images array
                                                className='cursor-pointer bg-black/30 w-[30px] h-[30px] flex justify-center items-center rounded absolute top-2 right-2'>
                                                <FaTrashAlt className='text-white text-[18px]' />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className=' w-full h-full rounded-md border-2 border-gray-300 border-dashed '>
                                    <input id='uploadImage'
                                        name='uploadImage'
                                        onChange={handleOnChange}
                                        type="file" multiple hidden />
                                    <label htmlFor='uploadImage' className='bg-white hover:bg-gray-100 duration-300 cursor-pointer w-full h-full flex flex-col justify-center items-center'>
                                        <MdOutlineCloudUpload className=' text-[28px] text-gray-500' />
                                        <p className=' text-[16px] font-medium text-gray-500'>ອັບໂຫຼດຮູບພາບ</p>
                                    </label>
                                </div>
                            )
                        }
                    </div>
                    <div className=' flex-1 w-full flex flex-col gap-2'>
                        <div>
                            <label htmlFor="name" className=' block'>ຊື່:</label>
                            <input type="text"
                                value={pName}
                                onChange={handleChange}
                                name='name'
                                className='w-full px-2 pt-1 pb-0.5 placeholder:text-[12px] text-[14px] outline-none border-gray-300 border bg-white rounded'
                                placeholder='ກະລຸນາປ້ອນຊື່ອາຫານ...'
                            />
                        </div>
                        <div>
                            <label htmlFor="categoryId" className=' block'>ປະເພດອາຫານ:</label>
                            <Select
                                labelInValue
                                name='categoryId'
                                value={{ value: categoryId }} // เปลี่ยนจาก value={frmAddProduct.categoryId}
                                className='w-full text-gray-300'
                                onChange={(value) => {
                                    setCategoryId(value.value); // ปรับการจัดการค่า
                                }}
                                options={[
                                    {
                                        value: 1,
                                        label: 'ເຄື່ອງດື່ມ',
                                    },
                                    {
                                        value: 2,
                                        label: 'ທອດ',
                                    },
                                    {
                                        value: 3,
                                        label: 'ຕຳ',
                                    },
                                ]}
                            />
                        </div>
                        <div>
                            <label htmlFor="quantity" className=' block'>ຈຳນວນ:</label>
                            <input type="text"
                                name='quantity'
                                onChange={handleChange}
                                value={quantity}
                                className='w-full px-2 pt-1 pb-0.5 placeholder:text-[12px] text-[14px] outline-none border-gray-300 border bg-white rounded'
                                placeholder='ກະລຸນາປ້ອນຈຳນວນ...'
                            />
                        </div>
                        <div>
                            <label htmlFor="price" className=' block'>ລາຄາ:</label>
                            <input type="text"
                                name='price'
                                onChange={handleChange}
                                value={price}
                                className='w-full px-2 pt-1 pb-0.5 placeholder:text-[12px] text-[14px] outline-none border-gray-300 border bg-white rounded'
                                placeholder='ກະລຸນາປ້ອນລາຄາ...'
                            />
                        </div>
                    </div>
                </form>
                <div className=' flex justify-center items-center gap-x-4 mt-5'>
                    <button onClick={handleCancel}
                        className=' bg-red-500 text-white w-[70px] py-1 rounded border-1 border-transparent hover:border-1 hover:bg-transparent hover:border-red-500 hover:text-red-500 duration-300 cursor-pointer'>
                        ຍົກເລີກ
                    </button>
                    <button type='submit' onClick={handleSubmit}
                        className=' bg-blue-500 text-white w-[70px] py-1 rounded border-1 border-transparent hover:border-1 hover:bg-transparent hover:border-blue-500 hover:text-blue-500 duration-300 cursor-pointer'>
                        ບັນທຶກ
                    </button>
                </div>
            </Modal>
        </div>
    )
}

export default ModalProductEdit