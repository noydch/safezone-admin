import React, { useState } from 'react'

import logo from '../../assets/logo.webp'
import avatar1 from '../../assets/avatar/avatar-01.webp'
import avatar2 from '../../assets/avatar/avatar-02.webp'
import avatar3 from '../../assets/avatar/avatar-03.webp'
import avatar4 from '../../assets/avatar/avatar-04.webp'
import avatar5 from '../../assets/avatar/avatar-05.webp'
import avatar6 from '../../assets/avatar/avatar-06.webp'
import avatar7 from '../../assets/avatar/avatar-07.webp'
import avatar8 from '../../assets/avatar/avatar-08.webp'
import avatar9 from '../../assets/avatar/avatar-09.webp'

import { FaHome } from "react-icons/fa";
import { IoFastFoodSharp, IoPersonCircle } from "react-icons/io5";
import { BiSolidFoodMenu, BiSolidReport } from "react-icons/bi";
import { MdTableRestaurant, MdLogout, MdOutlineProductionQuantityLimits, MdOutlineImportantDevices } from "react-icons/md";
import { BsFillPersonVcardFill } from "react-icons/bs";
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { IoIosArrowDown } from "react-icons/io";

const Sidebar = ({ children }) => {
    const [avatar, setAvatar] = useState(avatar1);
    const [isAvatarMenuOpen, setIsAvatarMenuOpen] = useState(false)

    const handleChangeAvatar = (newAvatar) => {
        setAvatar(newAvatar);
        setIsAvatarMenuOpen(false)
    }

    const path = [
        {
            path: '/',
            name: 'ໜ້າຫຼັກ',
            icon: <FaHome />
        },
        {
            path: '/category',
            name: 'ປະເພດອາຫານ - ເຄື່ອງດື່ມ',
            icon: <IoFastFoodSharp />
        },
        {
            path: '/product',
            name: 'ລາຍການອາຫານ - ເຄື່ອງດື່ມ',
            icon: <BiSolidFoodMenu />
        },
        {
            path: '/sale',
            name: 'ຈັດການການຂາຍ',
            icon: <MdOutlineProductionQuantityLimits />
        },
        {
            path: '/table',
            name: 'ຈັດການໂຕະ',
            icon: <MdTableRestaurant />
        },
        {
            path: '/import-buy',
            name: 'ຈັດການການນຳເຂົ້າ - ສັ່ງຊື້',
            icon: <MdOutlineImportantDevices />
        },
        {
            path: '/employee',
            name: 'ຜູ້ໃຊ້ລະບົບ',
            icon: <IoPersonCircle />
        },
        {
            path: '/customer',
            name: 'ຂໍ້ມູນລູກຄ້າ',
            icon: <BsFillPersonVcardFill />
        },
        {
            path: '/report',
            name: 'ການລາຍງານ',
            icon: <BiSolidReport />
        },
    ]
    const avatarData = [
        {
            id: 1,
            picture: avatar1
        },
        {
            id: 2,
            picture: avatar2
        },
        {
            id: 3,
            picture: avatar3
        },
        {
            id: 4,
            picture: avatar4
        },
        {
            id: 5,
            picture: avatar5
        },
        {
            id: 6,
            picture: avatar6
        },
        {
            id: 7,
            picture: avatar7
        },
        {
            id: 8,
            picture: avatar8
        },
        {
            id: 9,
            picture: avatar9
        },
    ];

    const pathname = "/" + useLocation().pathname.split("/")[1];
    const isActivePath = (path) => { return pathname === path };


    return (
        <div className=' flex h-screen'>
            <section className=' sticky w-[220px] bg-white p-2 flex flex-col'>
                <div className=' flex justify-center my-5'>
                    <img src={logo} alt=""
                        className=' w-[120px]'
                    />
                </div>
                <div className=' w-full space-y-2 flex-1 mt-5'>
                    {
                        path.map((item, index) => (
                            <NavLink
                                key={index}
                                to={item.path}
                                end
                                className={`${isActivePath(item.path) ? ' bg-red-100 border-2 border-red-700 text-red-700' : ' border-2 border-transparent'} flex items-center gap-x-2 p-1.5 text-[16px] font-semibold rounded-md hover:bg-red-100 hover:border-2 hover:border-red-500 hover:text-red-500 duration-200`}
                            >
                                <div className=' text-[22px]'>
                                    {item.icon}
                                </div>
                                {item.name}
                            </NavLink>
                        ))
                    }
                </div>
                <footer className=''>
                    <NavLink
                        to={'/login'}
                        end
                        className={({ isActive }) => `${isActive ? ' bg-red-100 border-2 border-red-700 text-red-700' : ' border-2 border-transparent'} flex items-center gap-x-2 p-1.5 text-[16px] font-semibold rounded-md hover:bg-red-100 hover:border-2 hover:border-red-500 hover:text-red-500 duration-200`}
                    >
                        <MdLogout className=' text-[24px]' />
                        ອອກຈາກລະບົບ
                    </NavLink>
                </footer>
            </section>
            <section className=' w-full h-screen flex-1 flex flex-col'>
                <nav className=' bg-white w-full h-[70px] flex items-center justify-end px-4 drop-shadow-sm'>
                    <div className=' flex items-center justify-between p-1 px-2 rounded gap-2 w-[220px] bg-white drop-shadow'>
                        <div className=' relative flex items-center gap-x-2'>
                            <div className=' cursor-pointer w-[40px] h-[40px] rounded-full border border-gray-700'
                                onClick={() => setIsAvatarMenuOpen(!isAvatarMenuOpen)}
                            >
                                <img src={avatar} alt=""
                                    className=' w-full rounded-full'
                                />
                            </div>
                            {
                                isAvatarMenuOpen && (
                                    <div className=' flex absolute duration-300 top-12 bg-white p-2 rounded -right-10'>
                                        {
                                            avatarData.map((avatarItem) => (
                                                <div className=' cursor-pointer w-[40px] h-[40px] rounded-full'
                                                    onClick={() => handleChangeAvatar(avatarItem.picture)}
                                                >
                                                    <img src={avatarItem.picture} alt="Avatar"
                                                        className=' h-8 w-8 rounded-full'
                                                    />
                                                </div>
                                            ))
                                        }
                                    </div>
                                )
                            }
                            <p className=' font-medium'>
                                Saysamone Dch
                            </p>
                        </div>
                        <IoIosArrowDown />
                    </div>
                </nav>
                <main className=' flex-1 p-4 bg-gray-100 overflow-y-auto'>
                    {children}
                </main>
            </section>
        </div>
    )
}

export default Sidebar