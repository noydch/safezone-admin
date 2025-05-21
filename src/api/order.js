import axios from "axios"
import ApiPath from "./apiPath"

export const createOrderApi = async (token, data) => {
    return axios.post(ApiPath.createOrder, data, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
}

export const updateOrderApi = async (token, id, status) => {
    const data = { status: status };
    console.log('Sending update:', { id, data });

    return axios.put(`${ApiPath.updateOrder}/${id}`, data, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
}

export const getOrderByIdApi = async (token, id) => {
    return axios.get(`${ApiPath.getOrderById}/${id}`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
}

