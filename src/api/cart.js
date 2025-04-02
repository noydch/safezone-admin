import axios from "axios"
import ApiPath from "./apiPath"

export const addCartApi = async (token, cart) => {
    console.log("📢 Token:", token);
    console.log("📤 Sending Cart Data:", cart); // ตรวจสอบข้อมูลที่ถูกส่ง

    return await axios.post(ApiPath.addCart, cart, {
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    });
};
