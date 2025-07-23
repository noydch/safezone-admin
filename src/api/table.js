import axios from "axios"
import ApiPath from "./apiPath"

// ✅ Get All Tables
export const getTableApi = async () => {
    return await axios.get(ApiPath.getTable)
}

// ✅ Get Grouped Tables
export const getTableGroupsApi = async () => {
    return await axios.get(ApiPath.getGroupTable)
}

// ✅ Delete Table
export const delTableApi = async (token, id) => {
    return await axios.delete(`${ApiPath.delTable}/${id}`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
}

// ✅ Insert Table
export const insertTableApi = async (token, data) => {
    return await axios.post(ApiPath.insertTable, data, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
}

// ✅ Update Table
export const updateTableApi = async (token, id, data) => {
    return await axios.put(`${ApiPath.updateTable}/${id}`, data, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
}

// ✅ Get Single Table by ID (ใหม่แต่ใช้ชื่อที่เหมาะสม)
export const getTableByIdApi = async (token, id) => {
    return await axios.get(`${ApiPath.getTable}/${id}`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
}
