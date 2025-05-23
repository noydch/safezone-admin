import axios from "axios"
import ApiPath from "./apiPath"

export const createOrderApi = async (token, data) => {
    return axios.post(ApiPath.createOrder, data, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
}

export const updateRoundStatusApi = async (token, roundId, status) => {
    const data = { status: status };
    console.log('Sending update round status:', { roundId, data });


    return axios.put(`${ApiPath.updateRoundStatus}/${roundId}`, data, { // ใช้ PUT หรือ PATCH ตามที่คุณตั้งค่าใน Backend
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
};

// (แนะนำ) อาจจะเพิ่มฟังก์ชันสำหรับดึง Order ทั้งหมดด้วย
export const getAllOrdersApi = async (token) => {
    return axios.get(ApiPath.getOrders, { // สมมติว่ามี Path นี้
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
};

export const getOrderByIdApi = async (token, id) => {
    return axios.get(`${ApiPath.getOrderById}/${id}`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
}


export const checkoutOrderApi = async (token, orderId, paymentMethod) => {
    const data = { paymentMethod: paymentMethod };

    return axios.post(`${ApiPath.checkOutOrder}/${orderId}`, data, { // ใช้ POST ตาม Route ที่เราตั้ง
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
};