import axios from "axios"
import ApiPath from "./apiPath"

export const insetCategoryApi = async (token, name) => {
    return await axios.post(ApiPath.insertCategory, name, {
        headers: `Bearer ${token}`
    })
}

export const getCategoryApi = async () => {
    return await axios.get(ApiPath.getCategory)
}

export const delCategoryApi = async (token, id) => {
    return await axios.delete(`${ApiPath.delCategory}/${id}`, {
        headers: `Bearer ${token}`
    })
}

export const updateCategoryApi = async (token, id, name) => {
    return await axios.put(`${ApiPath.updateCategory}/${id}`, name, {
        headers: `Bearer ${token}`
    })
}