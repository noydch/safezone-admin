import axios from "axios"
import ApiPath from "./apiPath"

export const getTableApi = async () => {
    return await axios.get(ApiPath.getTable)
}

export const delTableApi = async (token, id) => {
    return await axios.delete(`${ApiPath.delTable}/${id}`, {
        headers: `Bearer ${token}`
    })
}

export const insertTableApi = async (token, data) => {
    console.log(data);

    return await axios.post(ApiPath.insertTable, data, {
        headers: `Bearer ${token}`
    })
}

export const updateTableApi = async (token, id, data) => {
    return await axios.put(`${ApiPath.updateTable}/${id}`, data, {
        headers: `Bearer ${token}`
    })
}