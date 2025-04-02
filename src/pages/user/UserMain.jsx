import React, { useEffect, useState } from 'react'
import Sidebar from '../../components/sidebar/Sidebar'
import User from '../../components/user/User'
import { getEmployeeApi } from '../../api/user'

const UserMain = () => {
    const [employee, setEmployee] = useState([])
    const fetchData = async () => {
        await getEmployeeApi()
            .then((res) => setEmployee(res?.data)
            ).catch((err) => (
                console.log(err)
            ))
    }
    useEffect(() => {
        fetchData()
    }, [])
    return (
        <Sidebar>
            <User employee={employee} />
        </Sidebar>
    )
}

export default UserMain