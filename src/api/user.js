import axios from "axios"
import ApiPath from "./apiPath"

export const getEmployeeApi = async () => {
    return await axios.get(ApiPath.getEmployee)
}

export const updateEmployee = async (token, id, data) => {
    return await axios.put(`${ApiPath.updateEmployee}/${id}`, data, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
}