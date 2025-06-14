import React, { useState, useEffect } from 'react'
import { Modal, Select, message } from 'antd'
import UploadFileAdd from './UploadFileAdd'
import { insertDrinkApi } from '../../api/product'
import useSafezoneStore from '../../store/safezoneStore'
import { LiaSpinnerSolid } from 'react-icons/lia'
import { getUnitApi } from '../../api/unit'

const ModalDrinkAdd = ({ form, setForm, categories, listDrink, user }) => {
    const token = localStorage.getItem('token')
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(false)
    const [baseUnits, setBaseUnits] = useState([]);

    useEffect(() => {
        const fetchUnits = async () => {
            try {
                const response = await getUnitApi();
                setBaseUnits(response.data);
            } catch (error) {
                console.error("Error fetching units:", error);
                message.error('Error fetching base units.');
            }
        };
        fetchUnits();
    }, []);
    console.log(baseUnits);

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    }

    const showModal = () => {
        if (user?.role === 'Owner' || user?.role === 'Manager') {
            setIsModalOpen(true);
            setForm({
                name: '',
                categoryId: undefined,
                baseUnitId: undefined,
                price: 0,
                image: '',
            });
        } else {
            message.error('ທ່ານບໍ່ມີສິດໃນການເພີ່ມເຄື່ອງດື່ມ');
        }
    };

    const handleOk = () => {
        setIsModalOpen(false);
        setForm({
            name: '',
            categoryId: undefined,
            baseUnitId: undefined,
            price: 0,
            image: '',
        });
    };

    const handleCancel = () => {
        setIsModalOpen(false);
        setForm({
            name: '',
            categoryId: undefined,
            baseUnitId: undefined,
            price: 0,
            image: '',
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.name || !form.baseUnitId || !form.price || !form.image) {
            message.error('ກະລຸນາປ້ອນຂໍ້ມູນໃຫ້ຄົບຖ້ວນ (ຊື່, ໜ່ວຍພື້ນຖານ, ລາຄາ, ແລະຮູບພາບ)');
            return;
        }
        setLoading(true)
        try {
            const formData = {
                ...form,
                price: Number(form.price) || 0,
            };
            const response = await insertDrinkApi(token, formData)
            if (response) {
                message.success("ເພີ່ມເຄື່ອງດື່ມສຳເລັດ!!!")
                listDrink()
                setForm({
                    name: '',
                    categoryId: undefined,
                    baseUnitId: undefined,
                    price: 0,
                    image: ''
                })
                handleCancel()
            }
        } catch (error) {
            console.log(error);
            message.error('ເກີດຂໍ້ຜິດພາດໃນການເພີ່ມເຄື່ອງດື່ມ');
        } finally {
            setLoading(false)
        }
    }

    return (
        <div>
            <button onClick={showModal}
                className='h-[35px] w-[120px] rounded bg-blue-500 text-center text-white border-2 border-transparent hover:border-2 hover:bg-transparent hover:border-blue-500 hover:text-blue-500 duration-300 cursor-pointer'>
                ເພີ່ມເຄື່ອງດື່ມ
            </button>
            <Modal footer={null} open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
                <h1 className=' text-center text-[20px] font-semibold mb-5'>
                    ເພີ່ມເຄື່ອງດື່ມ
                </h1>
                <form action="" onSubmit={handleSubmit}
                    className='flex gap-2 w-full h-[240px]'
                >
                    <div className=' flex-1 h-full flex justify-center items-center'>
                        <UploadFileAdd form={form} setForm={setForm} />
                    </div>
                    <div className=' flex-1 w-full flex flex-col gap-2'>
                        <div>
                            <label htmlFor="name" className=' block'>ຊື່:</label>
                            <input type="text"
                                value={form.name}
                                onChange={handleChange}
                                name='name'
                                className='w-full px-2 pt-1 pb-0.5 placeholder:text-[12px] text-[14px] outline-none border-gray-300 border bg-white rounded'
                                placeholder='ກະລຸນາປ້ອນຊື່ເຄື່ອງດື່ມ...'
                            />
                        </div>
                        <div>
                            <label htmlFor="categoryId" className=' block'>ປະເພດ:</label>
                            <Select
                                labelInValue
                                name='categoryId'
                                value={form.categoryId ? { value: form.categoryId, label: categories.find(c => c.id === form.categoryId)?.name || form.categoryId } : undefined}
                                placeholder="ເລືອກປະເພດ (ທາງເລືອກ)"
                                className='w-full'
                                style={{ width: '100%' }}
                                onChange={(value) => {
                                    setForm({
                                        ...form,
                                        categoryId: value ? value.value : undefined
                                    });
                                }}
                                options={
                                    categories.filter(category => category.name.includes('ເຄື່ອງດື່ມ'))
                                        .map((category) => ({
                                            value: category.id,
                                            label: category.name
                                        }))
                                }
                                allowClear
                            />
                        </div>
                        <div>
                            <label htmlFor="baseUnitId" className=' block'>ໜ່ວຍພື້ນຖານ:</label>
                            <Select
                                name='baseUnitId'
                                value={form.baseUnitId}
                                placeholder="ເລືອກໜ່ວຍພື້ນຖານ"
                                className='w-full'
                                style={{ width: '100%' }}
                                onChange={(value) => {
                                    setForm({
                                        ...form,
                                        baseUnitId: value
                                    });
                                }}
                                options={
                                    baseUnits?.map((unit) => ({
                                        value: unit.id,
                                        label: unit.name
                                    }))
                                }
                                allowClear
                            />
                        </div>
                        <div>
                            <label htmlFor="price" className=' block'>ລາຄາ (ຕໍ່ໜ່ວຍດຽວ):</label>
                            <input type="number"
                                name='price'
                                onChange={handleChange}
                                value={form.price || ''}
                                className='w-full px-2 pt-1 pb-0.5 placeholder:text-[12px] text-[14px] outline-none border-gray-300 border bg-white rounded'
                                placeholder='ກະລຸນາປ້ອນລາຄາ...'
                                min="0"
                            />
                        </div>
                    </div>
                </form>
                <div className=' flex justify-center items-center gap-x-4 mt-5'>
                    <button onClick={handleCancel}
                        type="button"
                        className=' bg-red-500 text-white w-[70px] py-1 rounded border-1 border-transparent hover:border-1 hover:bg-transparent hover:border-red-500 hover:text-red-500 duration-300 cursor-pointer'>
                        ຍົກເລີກ
                    </button>
                    <button onClick={handleSubmit}
                        type="button"
                        disabled={loading}
                        className=' bg-blue-500 text-white w-[100px] flex items-center justify-center py-1 rounded border-1 border-transparent hover:border-1 hover:bg-transparent hover:border-blue-500 hover:text-blue-500 duration-300 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed'>
                        {
                            loading ? <p className=' flex items-center gap-x-1.5'>
                                <span className=''>ກຳລັງບັນທຶກ</span>
                                <LiaSpinnerSolid className=' animate-spin text-[20px]' />
                            </p> :
                                "ບັນທຶກ"
                        }
                    </button>
                </div>
            </Modal>
        </div>
    )
}

export default ModalDrinkAdd