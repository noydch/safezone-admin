import React from 'react'
import Sidebar from '../../components/sidebar/Sidebar'
import Category from '../../components/category/Category'

const CategoryMain = () => {
    return (
        <Sidebar>
            <div>
                <Category />
            </div>
        </Sidebar>
    )
}

export default CategoryMain