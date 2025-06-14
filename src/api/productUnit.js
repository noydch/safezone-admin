import axios from "axios"
import ApiPath from "./apiPath"

export const insertProductUnit = async (token, data) => {
    return axios.post(ApiPath.createProductUnit, data, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
}

export const getAllProductUnitApi = async (token) => {
    return axios.get(ApiPath.getAllProductUnits, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
}

export const deleteProductUnitApi = async (token, id) => {
    return await axios.delete(`${ApiPath.deleteProductUnit}/${id}`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
}

export const updateProductUnitApi = async (token, id, data) => {
    return await axios.put(`${ApiPath.updateProductUnit}/${id}`, data, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
}

export const getProductUnitsByDrinkIdApi = async (token, drinkId) => {
    return axios.get(`${ApiPath.getAllProductUnits}?drinkId=${drinkId}`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
}