import axios from "axios";
import ApiPath from "./apiPath";

export const LoginApi = async (email, password) => {
    const data = { email, password };
    const config = { headers: { "Content-Type": "application/json" } };
    try {
      return await axios.post(ApiPath.login, data, config);
    } catch (error) {
      console.log(error);
      
    }
  };

