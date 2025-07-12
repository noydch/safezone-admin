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
import { BiSolidFoodMenu, BiSolidReport, BiListUl, BiPlusCircle, BiCog } from "react-icons/bi";
import { MdTableRestaurant, MdLogout, MdOutlineProductionQuantityLimits, MdOutlineImportantDevices, MdNoteAlt, MdDashboard } from "react-icons/md";
import { BsFillPersonVcardFill } from "react-icons/bs";
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { IoIosArrowDown } from "react-icons/io";
import { FaTruck } from "react-icons/fa";
import useSafezoneStore from '../../store/safezoneStore';

const Sidebar = ({ children }) => {
    const user = useSafezoneStore((state) => state.user);
    const navigate = useNavigate();
    const logoutAction = useSafezoneStore((state) => state.actionLogout);
    const [avatar, setAvatar] = useState(() => {
        // Load avatar from localStorage or use default
        return localStorage.getItem('avatar') || avatar1;
    });
    const [isAvatarMenuOpen, setIsAvatarMenuOpen] = useState(false);
    const [isProductMenuOpen, setIsProductMenuOpen] = useState(false);

    const handleChangeAvatar = (newAvatar) => {
        setAvatar(newAvatar);
        localStorage.setItem('avatar', newAvatar); // Save avatar to localStorage
        setIsAvatarMenuOpen(false);
    }

    const path = [
        {
            path: '/',
            name: 'ໜ້າການຂາຍ',
            icon: <MdOutlineProductionQuantityLimits />
        },
        {
            path: '/orders',
            name: 'ລາຍການອໍເດີ',
            icon: <MdNoteAlt />
        },
        {
            path: '/dashboard',
            name: 'Dashboard',
            icon: <MdDashboard />
        },
        {
            path: '/category',
            name: 'ປະເພດອາຫານ - ເຄື່ອງດື່ມ',
            icon: <IoFastFoodSharp />
        },
        {
            type: 'dropdown',
            name: 'ຈັດການສິນຄ້າ',
            icon: <BiSolidFoodMenu />,
            submenu: [
                {
                    path: '/product',
                    name: 'ລາຍການອາຫານ - ເຄື່ອງດື່ມ',
                    icon: <BiListUl className="text-[18px]" />
                },
                {
                    path: '/add-unit',
                    name: 'ເພີ່ມຫົວໜ່ວຍ',
                    icon: <BiPlusCircle className="text-[18px]" />
                },
                {
                    path: '/productUnit',
                    name: 'ຈັດການຫົວໜ່ວຍສິນຄ້າ',
                    icon: <BiCog className="text-[18px]" />
                }
            ]
        },
        {
            path: '/booking',
            name: 'ຈັດການການຈອງ',
            icon: <MdTableRestaurant />
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
            path: '/supplier',
            name: 'ຂໍ້ມູນຜູ້ສະໝອງ',
            icon: <FaTruck />
        },
        {
            path: '/reports',
            name: 'ລາຍງານ',
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

    // เพิ่มฟังก์ชันใหม่สำหรับตรวจสอบ active ของ submenu
    const isSubmenuActive = (submenu) => {
        return submenu.some(item => item.path === pathname);
    };

    return (
        <div className=' flex h-screen'>
            <section className=' sticky w-[220px] bg-white p-2 flex flex-col z-50'>
                <div className=' flex justify-center my-1'>
                    <img src={logo} alt=""
                        className=' w-[120px]'
                    />
                </div>
                <div className=' w-full space-y-1 flex-1 mt-5'>
                    {
                        path.map((item, index) => (
                            item.type === 'dropdown' ? (
                                <div key={index}>
                                    <div
                                        onClick={() => setIsProductMenuOpen(!isProductMenuOpen)}
                                        className={`${isSubmenuActive(item.submenu) ? ' bg-red-100 border-2 border-red-700 text-red-700' : ' border-2 border-transparent'} flex items-center gap-x-2 p-1.5 text-[14px] font-semibold rounded-md hover:bg-red-100 hover:border-2 hover:border-red-500 hover:text-red-500 duration-200 cursor-pointer`}
                                    >
                                        <div className=' text-[18px]'>
                                            {item.icon}
                                        </div>
                                        {item.name}
                                        <IoIosArrowDown className={`ml-auto transition-transform ${isProductMenuOpen ? 'rotate-180' : ''}`} />
                                    </div>
                                    {isProductMenuOpen && (
                                        <div className="ml-6 mt-2 space-y-2">
                                            {item.submenu.map((subItem, subIndex) => (
                                                <NavLink
                                                    key={subIndex}
                                                    to={subItem.path}
                                                    className={({ isActive }) => `${isActive ? ' bg-red-100 border-2 border-red-700 text-red-700' : ' border-2 border-transparent'} flex items-center gap-x-2 p-1.5 text-[12px] font-semibold rounded-md hover:bg-red-100 hover:border-2 hover:border-red-500 hover:text-red-500 duration-200`}
                                                >
                                                    {subItem.icon}
                                                    {subItem.name}
                                                </NavLink>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <NavLink
                                    key={index}
                                    to={item.path}
                                    end
                                    className={`${isActivePath(item.path) ? ' bg-red-100 border-2 border-red-700 text-red-700' : ' border-2 border-transparent'} flex items-center gap-x-2 p-1.5 text-[14px] font-semibold rounded-md hover:bg-red-100 hover:border-2 hover:border-red-500 hover:text-red-500 duration-200`}
                                >
                                    <div className=' text-[18px]'>
                                        {item.icon}
                                    </div>
                                    {item.name}
                                </NavLink>
                            )
                        ))
                    }
                </div>
                <footer className=''>
                    <button
                        onClick={() => {
                            logoutAction();
                            navigate('/login');
                        }}
                        className='w-full flex items-center gap-x-2 p-1.5 text-[16px] font-semibold rounded-md bg-white border-2 border-transparent hover:bg-red-100 hover:border-red-500 hover:text-red-500 duration-200'
                    >
                        <MdLogout className=' text-[24px]' />
                        ອອກຈາກລະບົບ
                    </button>
                </footer>

            </section>
            <section className=' w-full h-screen flex-1 flex flex-col'>
                <nav className=' bg-white w-full h-[70px] flex items-center justify-end px-4 drop-shadow-lg sticky z-40'>
                    <div className=' flex items-center justify-end p-1 px-2 rounded gap-2 w-[300px] bg-white'>
                        <div
                            className=' relative flex items-center gap-x-2'>
                            <div className=' cursor-pointer w-[40px] h-[40px] rounded-full border border-gray-700'
                                onClick={() => setIsAvatarMenuOpen(!isAvatarMenuOpen)}
                            >
                                <img src={avatar} alt=""
                                    className=' w-full rounded-full'
                                />
                            </div>
                            {
                                isAvatarMenuOpen && (
                                    <div
                                        className=' flex absolute top-12 bg-white p-2 rounded -right-10'>
                                        {
                                            avatarData.map((avatarItem) => (
                                                <div className=' cursor-pointer hover:border-2 hover:border-gray-700 duration-300 border-2 border-transparent w-[40px] h-[40px] rounded-full'
                                                    onClick={() => handleChangeAvatar(avatarItem.picture)}
                                                >
                                                    <img src={avatarItem.picture} alt="Avatar"
                                                        className=' h-full w-full rounded-full'
                                                    />
                                                </div>
                                            ))
                                        }
                                    </div>
                                )
                            }
                            <p className=' font-medium'>
                                {user ? `${user.fname} ${user.lname}` : 'Loading User...'}
                            </p>
                        </div>
                        {/* <IoIosArrowDown /> */}
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