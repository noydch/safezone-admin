import React, { useEffect, useState } from 'react';
import { Button, Checkbox, Form, Input, message } from 'antd';

import bg from '../../assets/bg.jpg'
import { LoginApi } from '../../api/auth';
import { useNavigate } from 'react-router-dom';
import { FaRegEye, FaRegEyeSlash } from 'react-icons/fa';
import { LiaSpinnerSolid } from "react-icons/lia";
import useSafezoneStore from '../../store/safezoneStore';

const Login = () => {
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)
    const [showPassword, setShowPassword] = useState(true)
    const [rememberMe, setRememberMe] = useState(false)
    const actionLogin = useSafezoneStore((state) => state.actionLogin)
    const [form, setForm] = useState({
        email: '',
        password: ''
    })

    const handleChange = (e) => {
        // e.preventDefault();
        setForm({
            ...form,
            [e.target.name]: e.target.value
        })
    };

    useEffect(() => {
        const rememberedEmail = localStorage.getItem("rememberedEmail")
        if (rememberedEmail) {
            setForm((prev) => ({ ...prev, email: rememberedEmail }))
            setRememberMe(true)
        }
    }, [])


    const onFinish = async (e) => {
        e.preventDefault();
        setLoading(true)
        try {
            const response = await actionLogin({
                email: form.email,
                password: form.password
            })
            if (response) {
                setTimeout(() => {
                    localStorage.setItem("token", response?.data?.token)
                    // localStorage.setItem("user", response?.data?.payload)
                    setLoading(false)
                    navigate('/')
                    message.success("Login Success!!!")
                }, 3000)
            } else {
                message.warning("ອີເມລ ຫຼື ລະຫັດຜ່ານບໍ່ຖືກຕ້ອງ!!!")
                setLoading(false)
            }
        } catch (error) {
            console.log(error);
            setLoading(false)
        }
        if (rememberMe) {
            localStorage.setItem('rememberedEmail', form.email);
        } else {
            localStorage.removeItem("rememberedEmail");
        }
    };


    return (
        <div className=' w-full h-screen flex justify-center items-center relative z-[999]'>
            <div className='w-full h-full absolute top-0 left-0 z-[1]'>
                <img src={bg} alt=""
                    className=' w-full h-full'
                />
            </div>
            <div className=' rounded-md drop-shadow-lg bg-white z-50 w-[350px] h-[400px] flex items-center justify-center flex-col'>
                <h1 className=' text-[24px] font-semibold mb-10'>ເຂົ້າສູ່ລະບົບ</h1>
                <form
                    className=' w-[300px]'
                >
                    <div className=''>
                        <label className=' block'
                            htmlFor="">
                            Email <span className=' text-[12px] text-red-500'>*</span>
                        </label>
                        <input type="text" name="email"
                            value={form.email}
                            onChange={handleChange}
                            className='w-full rounded px-2 pt-1 focus:border-blue-500 pb-0.5 placeholder:text-[12px] border-2 border-gray-200 bg-white outline-none'
                            placeholder='ກະລຸນາປ້ອນອີເມລ...'
                        />
                    </div>
                    <div className='mt-2'>
                        <label className=' block'
                            htmlFor="">
                            ລະຫັດຜ່ານ <span className=' text-[12px] text-red-500'>*</span>
                        </label>
                        <div className=' relative w-full'>
                            <input type={`${showPassword ? 'password' : 'text'}`} name="password"
                                onChange={handleChange}
                                className='w-full rounded px-2 pt-1 focus:border-blue-500 pb-0.5 placeholder:text-[12px] border-2 border-gray-200 bg-white outline-none'
                                placeholder='ກະລຸນາປ້ອນລະຫັດຜ່ານ...'
                            />
                            {
                                form.password && (
                                    <div onClick={() => setShowPassword(!showPassword)}
                                        className=' cursor-pointer absolute right-2 -translate-y-[50%] top-[50%]' >
                                        {
                                            showPassword ?
                                                <FaRegEye />
                                                :
                                                <FaRegEyeSlash />
                                        }
                                    </div>
                                )
                            }
                        </div>
                    </div>
                    <div className=' flex items-center gap-x-1 mt-2'>
                        <input type="checkbox"
                            className='mr-1'
                            id='rememberMe'
                            checked={rememberMe}
                            onChange={() => setRememberMe(!rememberMe)}
                        />
                        <label htmlFor=""
                            className='text-[12px]'
                        >ຈື່ຂ້ອຍ</label>
                    </div>
                    <div className=' flex justify-center mt-10'>
                        <button type='submit' onClick={onFinish}
                            className=' text-[14px] cursor-pointer hover:bg-red-400 duration-300 font-medium bg-red-500 text-white w-[140px] h-[40px] rounded'>
                            {
                                loading ?
                                    <p className=' flex items-center justify-center gap-1'>
                                        ກຳລັງເຂົ້າສູ່ລະບົບ <LiaSpinnerSolid className=' animate-spin text-[16px]' />
                                    </p>
                                    :
                                    'ເຂົ້າສູ່ລະບົບ'
                            }
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
export default Login;