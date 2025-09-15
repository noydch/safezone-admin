import axios from "axios";
import ApiPath from "./apiPath";

export const LoginApi = async (email, password) => {
    const data = { email, password };
    const config = { headers: { "Content-Type": "application/json" } };
    try {
      return await axios.post(ApiPath.login, data, config);
    } catch (error) {
      // ถ้ามี response กลับจากเซิร์ฟเวอร์ ส่งกลับไปให้ caller ใช้ตัดสินใจได้
      if (error.response) return error.response;
      throw error; // network/CORS จะมาทางนี้
    }
  };

