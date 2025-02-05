import React from 'react'
import Sidebar from '../../components/sidebar/Sidebar'
import DashboardMain from '../../components/dashboard/DashboardMain'

const Dashboard = () => {
    return (
        <Sidebar>
            <div className=''>
                <DashboardMain />
            </div>
        </Sidebar>
    )
}

export default Dashboard