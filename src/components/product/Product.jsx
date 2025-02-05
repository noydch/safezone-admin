import React, { useState } from 'react'
import { categoryData, categoryData2, productData } from '../../../dataStore'

import food from '../../assets/food.webp'

const Product = () => {
    const [isSelected, setIsSelected] = useState('ທັງໝົດ')

    return (
        <div className=' p-2 bg-white rounded-md'>
            <ul className='p-2 grid grid-cols-12 place-items-center gap-4 overflow-x-auto'>
                {/* <li className=' w-[140px] rounded-md drop-shadow bg-white h-[45px] flex items-center justify-center border border-red-700 text-red-700 font-medium'>
                            ເຄື່ອງດື່ມທຳມະດາ
                        </li> */}
                {
                    categoryData2.map((categoryItem, index) => (
                        <li onClick={() => setIsSelected(categoryItem.categoryName)}
                            key={index} className={`${isSelected === categoryItem.categoryName ? 'text-red-500 border-2 border-red-500 hover:text-red-600 shadow-[2px_2px_5px_0px_#f56565]' : ''} cursor-pointer duration-300 hover:border-red-600 hover:text-red-600 hover:shadow-[2px_2px_5px_0px_#f56565] 
                        w-[200px] col-span-2 rounded-md drop-shadow bg-white h-[45px] flex items-center justify-center border border-gray-700 text-gray-700 font-medium`}>
                            {categoryItem.categoryName}
                        </li>
                    ))
                }
            </ul>

            <hr className=' border border-gray-100 my-3' />

            <div className=' '>
                <ul className=' grid grid-cols-5 place-items-center gap-4'>
                    {
                        productData
                            .filter(productItem => isSelected === 'ທັງໝົດ' || productItem.categoryName === isSelected)
                            .map((productItem, index) => (
                                <li key={index} className={` flex flex-col items-center w-[230px] h-[260px] p-2 border border-gray-200 drop-shadow-md rounded-md bg-white`}>
                                    <div className=' w-[220px] h-[160px] rounded-md'>
                                        <img src={productItem.picture} alt=""
                                            className=' w-[220px] h-[160px] rounded-md object-cover'
                                        />
                                    </div>
                                    <div className=' mt-2 w-full flex flex-col h-full'>
                                        <div className=' flex-1'>
                                            <div className=' flex items-end justify-between'>
                                                <p className=' text-[16px] font-medium'>
                                                    {productItem.pName}
                                                </p>
                                                <h4 className=' text-[18px] font-semibold text-red-500'>{(productItem.price).toLocaleString()} ກີບ</h4>
                                            </div>
                                        </div>
                                        <div className=' flex items-end justify-between'>
                                            <span className=' text-[12px]'>20/05/2024</span>
                                            <div className=' flex items-center gap-x-2'>
                                                <button
                                                    className=' bg-red-500 text-[14px] text-white w-[60px] py-0.5 rounded border-1 border-transparent hover:border-1 hover:bg-transparent hover:border-red-500 hover:text-red-500 duration-300 cursor-pointer'>
                                                    ລົບ
                                                </button>
                                                <button
                                                    className=' bg-blue-500 text-[14px] text-white w-[60px] py-0.5 rounded border-1 border-transparent hover:border-1 hover:bg-transparent hover:border-blue-500 hover:text-blue-500 duration-300 cursor-pointer'>
                                                    ແກ້ໄຂ
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </li>
                            ))
                    }
                </ul>
            </div>
        </div>
    )
}

export default Product
